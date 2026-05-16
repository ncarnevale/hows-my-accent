import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { usePlayback } from "@/hooks/usePlayback";

function attachAudio(
  audioRef: (node: HTMLAudioElement | null) => void,
): HTMLAudioElement {
  const audio = document.createElement("audio");
  act(() => audioRef(audio));
  return audio;
}

describe("usePlayback", () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts not playing and resets when the playback URL changes", async () => {
    const { result, rerender } = renderHook(
      ({ url }) => usePlayback(url),
      { initialProps: { url: "blob:first" as string | null } },
    );

    expect(result.current.isPlaying).toBe(false);

    attachAudio(result.current.audioRef);
    await act(async () => {
      result.current.togglePlayback();
    });
    expect(result.current.isPlaying).toBe(true);

    rerender({ url: "blob:second" });
    expect(result.current.isPlaying).toBe(false);
  });

  it("togglePlayback pauses without rewinding", async () => {
    const pauseSpy = vi.spyOn(HTMLMediaElement.prototype, "pause");

    const { result } = renderHook(() => usePlayback("blob:test"));
    const audio = attachAudio(result.current.audioRef);
    audio.currentTime = 8;

    await act(async () => {
      result.current.togglePlayback();
    });
    expect(result.current.isPlaying).toBe(true);

    act(() => {
      result.current.togglePlayback();
    });

    expect(pauseSpy).toHaveBeenCalled();
    expect(audio.currentTime).toBe(8);
    expect(result.current.isPlaying).toBe(false);
  });
});
