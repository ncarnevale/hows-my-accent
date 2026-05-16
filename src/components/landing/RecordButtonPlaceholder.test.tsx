import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RecordButtonPlaceholder } from "@/components/landing/RecordButtonPlaceholder";

describe("RecordButtonPlaceholder", () => {
  it("renders a disabled record button with helper text", () => {
    render(<RecordButtonPlaceholder />);

    const button = screen.getByRole("button", {
      name: /record your pronunciation \(coming soon\)/i,
    });

    expect(button).toBeDisabled();
    expect(screen.getByText(/recording coming soon/i)).toBeInTheDocument();
  });
});
