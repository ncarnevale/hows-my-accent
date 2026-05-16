import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ReadingPrompt } from "@/components/landing/ReadingPrompt";
import { MVP_PASSAGE_DISPLAY } from "@/data/passages";
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

describe("ReadingPrompt", () => {
  const toggleRecording = vi.fn();

  beforeEach(() => {
    toggleRecording.mockClear();

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

  it("renders the step indicator, prompt copy, and passage", () => {
    render(<ReadingPrompt />);

    expect(screen.getByText(/step 1 · read aloud/i)).toBeInTheDocument();
    expect(screen.getByText(/take a breath/i)).toBeInTheDocument();
    expect(screen.getByText(/natural pace/i)).toBeInTheDocument();
    expect(screen.getByText(MVP_PASSAGE_DISPLAY)).toBeInTheDocument();
    expect(screen.getByText(/your passage/i)).toBeInTheDocument();
  });

  it("renders an enabled record button when idle", () => {
    render(<ReadingPrompt />);

    expect(
      screen.getByRole("button", { name: /record your pronunciation/i })
    ).toBeEnabled();
    expect(screen.getByText(/tap to record/i)).toBeInTheDocument();
  });

  it("calls toggleRecording when the record button is pressed", async () => {
    const user = userEvent.setup();
    render(<ReadingPrompt />);

    await user.click(
      screen.getByRole("button", { name: /record your pronunciation/i })
    );

    expect(toggleRecording).toHaveBeenCalledTimes(1);
  });

  it("flows from idle through recording to playback and submit", async () => {
    const user = userEvent.setup();
    const stream = createMockMediaStream();
    const blob = new Blob(["audio"], { type: "audio/webm" });
    const onSubmit = vi.fn();

    const { rerender } = render(<ReadingPrompt onSubmit={onSubmit} />);

    await user.click(
      screen.getByRole("button", { name: /record your pronunciation/i })
    );
    expect(toggleRecording).toHaveBeenCalledTimes(1);

    vi.mocked(useAudioRecorder).mockReturnValue(
      mockRecorderState({ status: "recording", stream, toggleRecording })
    );
    rerender(<ReadingPrompt onSubmit={onSubmit} />);

    expect(
      screen.getByRole("img", { name: /recording level/i })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /stop recording/i }));
    expect(toggleRecording).toHaveBeenCalledTimes(2);

    vi.mocked(useAudioRecorder).mockReturnValue(
      mockRecorderState({ status: "recorded", blob, toggleRecording })
    );
    rerender(<ReadingPrompt onSubmit={onSubmit} />);

    expect(
      screen.queryByRole("button", {
        name: /record your pronunciation|record again/i,
      })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /try again/i })
    ).toBeInTheDocument();

    const playButton = screen.getByRole("button", { name: /play recording/i });
    expect(playButton).toBeInTheDocument();

    await user.click(playButton);

    await user.click(
      screen.getByRole("button", { name: /submit recording/i })
    );

    expect(onSubmit).toHaveBeenCalledWith(blob);
  });

  it("shows the main record button again after Try again starts a new take", async () => {
    const user = userEvent.setup();
    const blob = new Blob(["audio"], { type: "audio/webm" });

    vi.mocked(useAudioRecorder).mockReturnValue(
      mockRecorderState({ status: "recorded", blob, toggleRecording })
    );

    const { rerender } = render(<ReadingPrompt />);

    await user.click(screen.getByRole("button", { name: /try again/i }));
    expect(toggleRecording).toHaveBeenCalledTimes(1);

    vi.mocked(useAudioRecorder).mockReturnValue(
      mockRecorderState({
        status: "recording",
        stream: createMockMediaStream(),
        toggleRecording,
      })
    );
    rerender(<ReadingPrompt />);

    expect(
      screen.getByRole("button", { name: /stop recording/i })
    ).toBeInTheDocument();
  });
});
