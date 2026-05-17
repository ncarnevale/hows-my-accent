import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LandingPage } from "@/components/landing/LandingPage";
import { createMockMediaStream } from "@/hooks/__tests__/mediaMocks";
import {
  useAudioRecorder,
  type RecordingStatus,
} from "@/hooks/useAudioRecorder";
import { analyzeRecording } from "@/lib/analyzeClient";
import { MVP_PASSAGE_DISPLAY } from "@/lib/passages";

vi.mock("@/hooks/useAudioRecorder");
vi.mock("@/lib/analyzeClient");

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

describe("LandingPage", () => {
  const toggleRecording = vi.fn();

  beforeEach(() => {
    toggleRecording.mockClear();

    vi.mocked(useAudioRecorder).mockReturnValue(
      mockRecorderState({ toggleRecording })
    );

    vi.mocked(analyzeRecording).mockResolvedValue({
      transcript: "mock transcript",
      mismatchedWords: ["perro"],
    });

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

  it("shows the landing hero initially", () => {
    render(<LandingPage />);

    expect(
      screen.getByRole("heading", { name: /how's your spanish accent/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /test your accent/i })
    ).toBeInTheDocument();
    expect(screen.queryByText(MVP_PASSAGE_DISPLAY)).not.toBeInTheDocument();
  });

  it("reveals the reading prompt when CTA is clicked", async () => {
    const user = userEvent.setup();
    render(<LandingPage />);

    await user.click(screen.getByRole("button", { name: /test your accent/i }));

    expect(screen.getByText(MVP_PASSAGE_DISPLAY)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /record your pronunciation/i })
    ).toBeEnabled();
  });

  it("returns to the landing hero when Back is clicked", async () => {
    const user = userEvent.setup();
    render(<LandingPage />);

    await user.click(screen.getByRole("button", { name: /test your accent/i }));
    await user.click(screen.getByRole("button", { name: /back/i }));

    expect(
      screen.getByRole("heading", { name: /how's your spanish accent/i })
    ).toBeInTheDocument();
    expect(screen.queryByText(MVP_PASSAGE_DISPLAY)).not.toBeInTheDocument();
  });

  it("flows from recording through analysis to mismatched word results", async () => {
    const user = userEvent.setup();
    const stream = createMockMediaStream();
    const blob = new Blob(["audio"], { type: "audio/webm" });
    let resolveAnalyze!: (value: Awaited<ReturnType<typeof analyzeRecording>>) => void;

    vi.mocked(analyzeRecording).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveAnalyze = resolve;
        })
    );

    const { rerender } = render(<LandingPage />);

    await user.click(screen.getByRole("button", { name: /test your accent/i }));

    await user.click(
      screen.getByRole("button", { name: /record your pronunciation/i })
    );

    vi.mocked(useAudioRecorder).mockReturnValue(
      mockRecorderState({ status: "recording", stream, toggleRecording })
    );
    rerender(<LandingPage />);

    await user.click(screen.getByRole("button", { name: /stop recording/i }));

    vi.mocked(useAudioRecorder).mockReturnValue(
      mockRecorderState({ status: "recorded", blob, toggleRecording })
    );
    rerender(<LandingPage />);

    await user.click(screen.getByRole("button", { name: /play recording/i }));
    await user.click(
      screen.getByRole("button", { name: /submit recording/i })
    );

    expect(
      screen.getByRole("status", { name: /analyzing your pronunciation/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/analyzing your pronunciation/i)).toBeInTheDocument();

    resolveAnalyze({
      transcript: "mock transcript",
      mismatchedWords: ["perro"],
    });

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /pronunciation results/i }),
      ).toBeInTheDocument();
    });

    expect(screen.getByText(/\d+ \/ 10/)).toBeInTheDocument();
    expect(screen.getByText(/rolled rr/i)).toBeInTheDocument();
    expect(analyzeRecording).toHaveBeenCalledWith(blob, "lam-intro");
  });
});
