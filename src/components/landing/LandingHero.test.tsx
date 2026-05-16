import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LandingHero } from "@/components/landing/LandingHero";

describe("LandingHero", () => {
  it("renders headline and CTA", () => {
    render(<LandingHero onStart={vi.fn()} />);

    expect(
      screen.getByRole("heading", { name: /how's your spanish accent/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /test your accent/i })
    ).toBeInTheDocument();
  });

  it("calls onStart when CTA is clicked", async () => {
    const onStart = vi.fn();
    const user = userEvent.setup();

    render(<LandingHero onStart={onStart} />);
    await user.click(screen.getByRole("button", { name: /test your accent/i }));

    expect(onStart).toHaveBeenCalledOnce();
  });
});
