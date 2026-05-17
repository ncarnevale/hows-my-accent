import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AnalysisLoading } from "@/components/feedback/AnalysisLoading";

describe("AnalysisLoading", () => {
  it("shows analyzing status with accessible busy state", () => {
    render(<AnalysisLoading />);

    const status = screen.getByRole("status", {
      name: /analyzing your pronunciation/i,
    });
    expect(status).toBeInTheDocument();
    expect(status).toHaveAttribute("aria-busy", "true");
  });

  it("renders decorative waveform bars", () => {
    render(<AnalysisLoading />);

    const bars = document.querySelectorAll("[data-waveform-bar]");
    expect(bars.length).toBeGreaterThanOrEqual(16);
    expect(bars.length).toBeLessThanOrEqual(24);
  });
});
