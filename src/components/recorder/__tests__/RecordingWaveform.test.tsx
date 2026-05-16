import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { RecordingWaveform } from "@/components/recorder/RecordingWaveform";
import { createMockMediaStream } from "@/hooks/__tests__/mediaMocks";

describe("RecordingWaveform", () => {
  let rafCallback: FrameRequestCallback | undefined;
  let rafId: number;

  beforeEach(() => {
    rafId = 0;
    rafCallback = undefined;

    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      rafCallback = cb;
      rafId += 1;
      return rafId;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});

    class MockAudioContext {
      state = "running";
      createAnalyser = vi.fn(() => ({
        fftSize: 512,
        frequencyBinCount: 32,
        getByteFrequencyData: vi.fn((array: Uint8Array) => {
          array.forEach((_, index) => {
            array[index] = index % 2 === 0 ? 200 : 80;
          });
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

  it("renders frequency bars with accessible recording level label", () => {
    const stream = createMockMediaStream();

    render(<RecordingWaveform stream={stream} />);

    const waveform = screen.getByRole("img", { name: /recording level/i });
    expect(waveform).toBeInTheDocument();

    rafCallback?.(0);

    const bars = waveform.querySelectorAll("[data-waveform-bar]");
    expect(bars.length).toBeGreaterThanOrEqual(16);
    expect(bars.length).toBeLessThanOrEqual(24);
  });

  it("cleans up animation frame and audio context on unmount", () => {
    const stream = createMockMediaStream();
    const cancelAnimationFrameSpy = vi.spyOn(window, "cancelAnimationFrame");

    const { unmount } = render(<RecordingWaveform stream={stream} />);
    rafCallback?.(0);

    unmount();

    expect(cancelAnimationFrameSpy).toHaveBeenCalled();
  });
});
