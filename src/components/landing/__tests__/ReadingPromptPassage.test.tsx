import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ReadingPromptPassage } from "@/components/landing/ReadingPromptPassage";
import { MVP_PASSAGE_DISPLAY } from "@/lib/passages";

describe("ReadingPromptPassage", () => {
  it("renders the passage label and story text", () => {
    render(<ReadingPromptPassage />);

    expect(screen.getByText(/your passage/i)).toBeInTheDocument();
    expect(screen.getByText(/a short story · latam spanish/i)).toBeInTheDocument();
    expect(screen.getByText(MVP_PASSAGE_DISPLAY)).toBeInTheDocument();
  });

  it("renders sound highlight tags", () => {
    render(<ReadingPromptPassage />);

    expect(screen.getByText("rr")).toBeInTheDocument();
    expect(screen.getByText("ñ")).toBeInTheDocument();
  });
});
