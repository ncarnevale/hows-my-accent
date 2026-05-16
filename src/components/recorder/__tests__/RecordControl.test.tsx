import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { RecordControl } from "@/components/recorder/RecordControl";
import { createMockMediaStream } from "@/hooks/__tests__/mediaMocks";
import {
  useAudioRecorder,
  type RecordingStatus,
} from "@/hooks/useAudioRecorder";

vi.mock("@/hooks/useAudioRecorder");

function mockRecorderState(
  overrides: Partial<ReturnType<typeof useAudioRecorder>> = {}
) {
  return {
    status: "idle" as RecordingStatus,
    blob: null,
    stream: null,
    error: null,
    mimeType: "audio/webm",
    startRecording: vi.fn(),
    stopRecording: vi.fn(),
    reset: vi.fn(),
    toggleRecording: vi.fn(),
    ...overrides,
  };
}

describe("RecordControl", () => {
  const toggleRecording = vi.fn();
  const onSubmit = vi.fn();

  beforeEach(() => {
    toggleRecording.mockClear();
    onSubmit.mockClear();

    vi.mocked(useAudioRecorder).mockReturnValue(
      mockRecorderState({ toggleRecording })
    );

    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-playback");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});

    vi.spyOn(window, "requestAnimationFrame").mockImplementation(() => 1);
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});

    class MockAudioContext {
      state = "running";
      createAnalyser = vi.fn(() => ({
        fftSize: 512,
        frequencyBinCount: 16,
        getByteFrequencyData: vi.fn((array: Uint8Array) => {
          array.fill(128);
        }),
      }));
      createMediaStreamSource = vi.fn(() => ({
        connect: vi.fn(),
        disconnect: vi.fn(),
      }));
      close = vi.fn().mockResolvedValue(undefined);
    }

    vi.stubGlobal("AudioContext", MockAudioContext);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("renders an enabled record button when idle", () => {
    render(<RecordControl onSubmit={onSubmit} />);

    const button = screen.getByRole("button", {
      name: /record your pronunciation/i,
    });

    expect(button).toBeEnabled();
    expect(screen.getByText(/tap to record/i)).toBeInTheDocument();
  });

  it("shows the recording waveform while recording", () => {
    const stream = createMockMediaStream();

    vi.mocked(useAudioRecorder).mockReturnValue(
      mockRecorderState({ status: "recording", stream, toggleRecording })
    );

    render(<RecordControl onSubmit={onSubmit} />);

    expect(
      screen.getByRole("img", { name: /recording level/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /stop recording/i })
    ).toBeInTheDocument();
  });

  it("calls toggleRecording when the main button is pressed", async () => {
    const user = userEvent.setup();

    render(<RecordControl onSubmit={onSubmit} />);

    await user.click(
      screen.getByRole("button", { name: /record your pronunciation/i })
    );

    expect(toggleRecording).toHaveBeenCalledTimes(1);
  });

  it("hides main record button after a take is recorded", () => {
    const blob = new Blob(["audio"], { type: "audio/webm" });

    vi.mocked(useAudioRecorder).mockReturnValue(
      mockRecorderState({ status: "recorded", blob, toggleRecording })
    );

    render(<RecordControl onSubmit={onSubmit} />);

    expect(
      screen.queryByRole("button", {
        name: /record your pronunciation|record again/i,
      })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /try again/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /play recording/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /submit recording/i })
    ).toBeInTheDocument();
  });

  it("offers playback and submit after recording stops", async () => {
    const user = userEvent.setup();
    const blob = new Blob(["audio"], { type: "audio/webm" });

    vi.mocked(useAudioRecorder).mockReturnValue(
      mockRecorderState({ status: "recorded", blob, toggleRecording })
    );

    render(<RecordControl onSubmit={onSubmit} />);

    expect(
      screen.getByRole("button", { name: /try again/i })
    ).toBeInTheDocument();

    const playButton = screen.getByRole("button", { name: /play recording/i });
    expect(playButton).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /submit recording/i })
    ).toBeInTheDocument();

    const audio = document.querySelector("audio");
    expect(audio).toHaveAttribute("src", "blob:mock-playback");

    await user.click(playButton);

    await user.click(
      screen.getByRole("button", { name: /submit recording/i })
    );

    expect(onSubmit).toHaveBeenCalledWith(blob);
  });

  it("calls toggleRecording when Try again is pressed", async () => {
    const user = userEvent.setup();
    const blob = new Blob(["audio"], { type: "audio/webm" });

    vi.mocked(useAudioRecorder).mockReturnValue(
      mockRecorderState({ status: "recorded", blob, toggleRecording })
    );

    render(<RecordControl onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: /try again/i }));

    expect(toggleRecording).toHaveBeenCalledTimes(1);
  });

  it("shows Pause while playback is active", async () => {
    const user = userEvent.setup();
    const blob = new Blob(["audio"], { type: "audio/webm" });

    vi.mocked(useAudioRecorder).mockReturnValue(
      mockRecorderState({ status: "recorded", blob, toggleRecording })
    );

    render(<RecordControl onSubmit={onSubmit} />);

    await user.click(
      screen.getByRole("button", { name: /play recording/i })
    );

    const audio = document.querySelector("audio");
    audio?.dispatchEvent(new Event("play"));

    expect(
      screen.getByRole("button", { name: /pause recording/i })
    ).toBeInTheDocument();
  });

  it("pauses playback when Pause is pressed", async () => {
    const user = userEvent.setup();
    const blob = new Blob(["audio"], { type: "audio/webm" });
    const pauseSpy = vi
      .spyOn(HTMLMediaElement.prototype, "pause")
      .mockImplementation(function (this: HTMLMediaElement) {
        this.dispatchEvent(new Event("pause"));
      });

    vi.mocked(useAudioRecorder).mockReturnValue(
      mockRecorderState({ status: "recorded", blob, toggleRecording })
    );

    render(<RecordControl onSubmit={onSubmit} />);

    await user.click(
      screen.getByRole("button", { name: /play recording/i })
    );

    const audio = document.querySelector("audio") as HTMLAudioElement;
    audio.currentTime = 12;
    audio.dispatchEvent(new Event("play"));

    await user.click(
      screen.getByRole("button", { name: /pause recording/i })
    );

    expect(pauseSpy).toHaveBeenCalled();
    expect(audio.currentTime).toBe(12);
    expect(
      screen.getByRole("button", { name: /play recording/i })
    ).toBeInTheDocument();
  });

  it("shows an inline error message in the error state", () => {
    vi.mocked(useAudioRecorder).mockReturnValue(
      mockRecorderState({
        status: "error",
        error: "Microphone access was denied.",
        toggleRecording,
      })
    );

    render(<RecordControl onSubmit={onSubmit} />);

    expect(screen.getByText(/microphone access was denied/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /try again/i })
    ).toBeInTheDocument();
  });
});
