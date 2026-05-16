import { render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { RecordControl } from "@/components/recorder/RecordControl";
import { createMockMediaStream } from "@/hooks/__tests__/mediaMocks";
import type { RecordingStatus } from "@/hooks/useAudioRecorder";

describe("RecordControl", () => {
  const defaultHandlers = {
    onToggleRecord: vi.fn(),
    onPlay: vi.fn(),
  };

  beforeEach(() => {
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

  function renderControl(
    props: Partial<ComponentProps<typeof RecordControl>> = {}
  ) {
    const status: RecordingStatus = props.status ?? "idle";
    return render(
      <RecordControl
        status={status}
        stream={props.stream ?? null}
        playbackUrl={props.playbackUrl ?? null}
        error={props.error ?? null}
        {...defaultHandlers}
        {...props}
      />
    );
  }

  it("renders an enabled record button when idle", () => {
    renderControl({ status: "idle" });

    const button = screen.getByRole("button", {
      name: /record your pronunciation/i,
    });

    expect(button).toBeEnabled();
    expect(screen.getByText(/tap to record/i)).toBeInTheDocument();
  });

  it("shows the recording waveform while recording", () => {
    const stream = createMockMediaStream();

    renderControl({ status: "recording", stream });

    expect(
      screen.getByRole("img", { name: /recording level/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /stop recording/i })
    ).toBeInTheDocument();
  });

  it("calls onToggleRecord when the main button is pressed", async () => {
    const user = userEvent.setup();
    const onToggleRecord = vi.fn();

    renderControl({ status: "idle", onToggleRecord });

    await user.click(
      screen.getByRole("button", { name: /record your pronunciation/i })
    );

    expect(onToggleRecord).toHaveBeenCalledTimes(1);
  });

  it("offers playback after recording stops", async () => {
    const user = userEvent.setup();
    const onPlay = vi.fn();

    renderControl({
      status: "recorded",
      playbackUrl: "blob:mock-playback",
      onPlay,
    });

    const playButton = screen.getByRole("button", { name: /play recording/i });
    expect(playButton).toBeInTheDocument();

    const audio = document.querySelector("audio");
    expect(audio).toHaveAttribute("src", "blob:mock-playback");

    await user.click(playButton);

    expect(onPlay).toHaveBeenCalledTimes(1);
  });

  it("shows an inline error message in the error state", () => {
    renderControl({
      status: "error",
      error: "Microphone access was denied.",
    });

    expect(screen.getByText(/microphone access was denied/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /try again/i })
    ).toBeInTheDocument();
  });
});
