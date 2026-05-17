import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AnalysisResults } from "@/components/feedback/AnalysisResults";

describe("AnalysisResults", () => {
  it("renders a perfect score and positive message when there are no mismatches", () => {
    render(<AnalysisResults words={[]} totalWords={100} />);

    expect(
      screen.getByRole("heading", { name: /pronunciation results/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/10 \/ 10/)).toBeInTheDocument();
    expect(screen.getByText(/perfect!/i)).toBeInTheDocument();
    expect(screen.getByText(/nailed it! no notes!/i)).toBeInTheDocument();
    expect(screen.queryByText(/sounds to practice/i)).not.toBeInTheDocument();
  });

  it("renders score, label, and sound recommendations for mismatches", () => {
    render(<AnalysisResults words={["perro", "gato"]} totalWords={100} />);

    expect(screen.getByText(/9 \/ 10/)).toBeInTheDocument();
    expect(screen.getByText(/great!/i)).toBeInTheDocument();
    expect(screen.getByText(/sounds to practice/i)).toBeInTheDocument();
    expect(screen.getByText(/rolled rr/i)).toBeInTheDocument();
    expect(
      screen.getByText(/roll the double r with a quick tap/i),
    ).toBeInTheDocument();
    expect(screen.queryByText("perro")).not.toBeInTheDocument();
    expect(screen.queryByText("gato")).not.toBeInTheDocument();
  });

  it("calls onBack when Back is clicked", async () => {
    const onBack = vi.fn();
    const user = userEvent.setup();

    render(<AnalysisResults words={["perro"]} totalWords={100} onBack={onBack} />);
    await user.click(screen.getByRole("button", { name: /back/i }));

    expect(onBack).toHaveBeenCalledOnce();
  });
});
