import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ReadingPrompt } from "@/components/landing/ReadingPrompt";
import { MVP_PASSAGE_DISPLAY } from "@/data/passages";

describe("ReadingPrompt", () => {
  it("renders the step indicator, prompt copy, and passage", () => {
    render(<ReadingPrompt />);

    expect(screen.getByText(/step 1 · read aloud/i)).toBeInTheDocument();
    expect(screen.getByText(/take a breath/i)).toBeInTheDocument();
    expect(screen.getByText(/natural pace/i)).toBeInTheDocument();
    expect(screen.getByText(MVP_PASSAGE_DISPLAY)).toBeInTheDocument();
    expect(screen.getByText(/your passage/i)).toBeInTheDocument();
  });

  it("renders the record placeholder", () => {
    render(<ReadingPrompt />);

    expect(
      screen.getByRole("button", {
        name: /record your pronunciation \(coming soon\)/i,
      })
    ).toBeDisabled();
    expect(screen.getByText(/recording coming soon/i)).toBeInTheDocument();
  });
});
