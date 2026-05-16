import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ReadingPrompt } from "@/components/landing/ReadingPrompt";
import { MVP_PASSAGE_DISPLAY } from "@/data/passages";

describe("ReadingPrompt", () => {
  it("renders instructions and formatted passage", () => {
    render(<ReadingPrompt />);

    expect(
      screen.getByText(/tap record, then read the passage aloud/i)
    ).toBeInTheDocument();
    expect(screen.getByText(MVP_PASSAGE_DISPLAY)).toBeInTheDocument();
    expect(screen.getByText("Your passage")).toBeInTheDocument();
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
