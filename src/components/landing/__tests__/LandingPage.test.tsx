import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LandingPage } from "@/components/landing/LandingPage";
import { MVP_PASSAGE_DISPLAY } from "@/lib/passages";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";

vi.mock("@/hooks/useAudioRecorder");

describe("LandingPage", () => {
  beforeEach(() => {
    vi.mocked(useAudioRecorder).mockReturnValue({
      status: "idle",
      blob: null,
      stream: null,
      error: null,
      mimeType: "audio/webm",
      startRecording: vi.fn(),
      stopRecording: vi.fn(),
      reset: vi.fn(),
      toggleRecording: vi.fn(),
    });
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
});
