import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ReadingPromptHeader } from "@/components/landing/ReadingPromptHeader";

describe("ReadingPromptHeader", () => {
  it("renders the headline with emphasized pacing", () => {
    render(<ReadingPromptHeader />);

    expect(screen.getByText(/take a breath/i)).toBeInTheDocument();
    expect(screen.getByText(/slowly/i)).toBeInTheDocument();
    expect(screen.getByText(/naturally/i)).toBeInTheDocument();
  });

  it("renders the supporting copy", () => {
    render(<ReadingPromptHeader />);

    expect(
      screen.getByText(/don't worry too much/i)
    ).toBeInTheDocument();
  });
});
