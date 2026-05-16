import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { LandingPage } from "@/components/landing/LandingPage";
import { MVP_PASSAGE_DISPLAY } from "@/data/passages";

describe("LandingPage", () => {
  it("shows the landing hero initially", () => {
    render(<LandingPage />);

    expect(
      screen.getByRole("heading", { name: /how's your spanish accent/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /test your accent/i })
    ).toBeInTheDocument();
    expect(screen.queryByText(MVP_PASSAGE_DISPLAY)).not.toBeInTheDocument();
  });

  it("reveals the reading prompt when CTA is clicked", async () => {
    const user = userEvent.setup();
    render(<LandingPage />);

    await user.click(screen.getByRole("button", { name: /test your accent/i }));

    expect(screen.getByText(MVP_PASSAGE_DISPLAY)).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /record your pronunciation \(coming soon\)/i,
      })
    ).toBeInTheDocument();
  });

  it("returns to the landing hero when Back is clicked", async () => {
    const user = userEvent.setup();
    render(<LandingPage />);

    await user.click(screen.getByRole("button", { name: /test your accent/i }));
    await user.click(screen.getByRole("button", { name: /back/i }));

    expect(
      screen.getByRole("heading", { name: /how's your spanish accent/i })
    ).toBeInTheDocument();
    expect(screen.queryByText(MVP_PASSAGE_DISPLAY)).not.toBeInTheDocument();
  });
});
