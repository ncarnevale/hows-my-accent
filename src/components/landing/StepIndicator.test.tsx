import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StepIndicator } from "@/components/landing/StepIndicator";

describe("StepIndicator", () => {
  it("renders the step number and label text", () => {
    render(<StepIndicator color="terracotta" stepNumber={2} text="Record" />);

    expect(screen.getByText(/step 2 · record/i)).toBeInTheDocument();
  });

  it("applies the dot color class from the color prop", () => {
    render(<StepIndicator color="jade" stepNumber={1} text="Read aloud" />);

    const indicator = screen.getByText(/step 1 · read aloud/i);
    const dot = indicator.querySelector("span");

    expect(dot).toHaveClass("bg-jade");
  });
});
