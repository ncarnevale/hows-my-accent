import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { installMediaMocks } from "./mediaMocks";

describe("useAudioRecorder", () => {
  let mocks: ReturnType<typeof installMediaMocks>;

  beforeEach(() => {
    mocks = installMediaMocks();
  });

  afterEach(() => {
    mocks.cleanup();
  });

  it("starts in idle state with no blob or stream", () => {
    const { result } = renderHook(() => useAudioRecorder());

    expect(result.current.status).toBe("idle");
    expect(result.current.blob).toBeNull();
    expect(result.current.stream).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("startRecording requests mic, starts MediaRecorder, and exposes stream", async () => {
    const { result } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.startRecording();
    });

    expect(mocks.getUserMedia).toHaveBeenCalledWith({ audio: true });
    expect(result.current.status).toBe("recording");
    expect(result.current.stream).toBe(mocks.stream);
    expect(mocks.instances).toHaveLength(1);
    expect(mocks.instances[0]?.start).toHaveBeenCalled();
  });

  it("stopRecording stops tracks, assembles blob, and moves to recorded", async () => {
    const { result } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.startRecording();
    });

    await act(async () => {
      result.current.stopRecording();
    });

    await waitFor(() => {
      expect(result.current.status).toBe("recorded");
    });

    expect(result.current.blob).toBeInstanceOf(Blob);
    expect(result.current.blob?.type).toBe(result.current.mimeType);
    expect(result.current.stream).toBeNull();
    for (const track of mocks.stream.getTracks()) {
      expect(track.stop).toHaveBeenCalled();
    }
  });

  it("ignores stopRecording when idle and startRecording when already recording", async () => {
    const { result } = renderHook(() => useAudioRecorder());

    act(() => {
      result.current.stopRecording();
    });

    expect(result.current.status).toBe("idle");

    await act(async () => {
      await result.current.startRecording();
    });

    const instanceCount = mocks.instances.length;

    await act(async () => {
      await result.current.startRecording();
    });

    expect(mocks.instances).toHaveLength(instanceCount);
    expect(result.current.status).toBe("recording");
  });

  it("sets error state when microphone access is denied", async () => {
    mocks.cleanup();
    mocks = installMediaMocks({
      getUserMediaReject: new DOMException("Permission denied", "NotAllowedError"),
    });

    const { result } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.startRecording();
    });

    expect(result.current.status).toBe("error");
    expect(result.current.error).toMatch(/microphone/i);
    expect(result.current.stream).toBeNull();
  });

  it("reset clears blob and returns to idle", async () => {
    const { result } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.startRecording();
    });

    await act(async () => {
      result.current.stopRecording();
    });

    await waitFor(() => {
      expect(result.current.status).toBe("recorded");
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.status).toBe("idle");
    expect(result.current.blob).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.stream).toBeNull();
  });

  it("toggleRecording starts, stops, and re-records", async () => {
    const { result } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.toggleRecording();
    });

    expect(result.current.status).toBe("recording");

    await act(async () => {
      result.current.toggleRecording();
    });

    await waitFor(() => {
      expect(result.current.status).toBe("recorded");
    });

    await act(async () => {
      await result.current.toggleRecording();
    });

    expect(result.current.status).toBe("recording");
    expect(result.current.blob).toBeNull();
    expect(mocks.instances.length).toBeGreaterThanOrEqual(2);
  });

  it("stops active tracks and recorder on unmount", async () => {
    const { result, unmount } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.startRecording();
    });

    const recorder = mocks.instances[0];
    const tracks = mocks.stream.getTracks();

    unmount();

    for (const track of tracks) {
      expect(track.stop).toHaveBeenCalled();
    }
    expect(recorder?.stop).toHaveBeenCalled();
  });
});
