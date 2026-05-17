import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AnalysisResults } from "@/components/feedback/AnalysisResults";

describe("AnalysisResults", () => {
  it("renders a heading and list of mismatched words", () => {
    render(<AnalysisResults words={["perro", "gato"]} />);

    expect(
      screen.getByRole("heading", { name: /pronunciation results/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByText("perro")).toBeInTheDocument();
    expect(screen.getByText("gato")).toBeInTheDocument();
  });

  it("shows empty state when there are no mismatches", () => {
    render(<AnalysisResults words={[]} />);

    expect(screen.getByText(/no mismatches detected/i)).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("calls onBack when Back is clicked", async () => {
    const onBack = vi.fn();
    const user = userEvent.setup();

    render(<AnalysisResults words={["perro"]} onBack={onBack} />);
    await user.click(screen.getByRole("button", { name: /back/i }));

    expect(onBack).toHaveBeenCalledOnce();
  });
});
