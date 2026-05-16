import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ReadingPromptHeader } from "@/components/landing/ReadingPromptHeader";

describe("ReadingPromptHeader", () => {
  it("renders the step indicator and headline", () => {
    render(<ReadingPromptHeader />);

    expect(screen.getByText(/step 1 · read aloud/i)).toBeInTheDocument();
    expect(screen.getByText(/take a breath/i)).toBeInTheDocument();
    expect(screen.getByText(/natural pace/i)).toBeInTheDocument();
  });

  it("renders the supporting copy", () => {
    render(<ReadingPromptHeader />);

    expect(
      screen.getByText(/don't aim for perfection/i)
    ).toBeInTheDocument();
  });
});
