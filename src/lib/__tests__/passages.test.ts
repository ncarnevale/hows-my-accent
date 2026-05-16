import { describe, expect, it } from "vitest";

import { MVP_PASSAGE } from "@/data/passages";
import {
  MVP_PASSAGE_DISPLAY,
  formatPassageText,
  getPassageById,
} from "@/lib/passages";

describe("formatPassageText", () => {
  it("collapses source line wraps into a single flowing paragraph", () => {
    const formatted = formatPassageText(MVP_PASSAGE.text);

    expect(formatted).not.toMatch(/\n(?!\n)/);
    expect(formatted).toContain("Queridos amigos");
    expect(formatted).toContain("la pronunciación.");
    expect(formatted).not.toContain("vi un\n");
  });

  it("preserves paragraph breaks from blank lines in source", () => {
    const formatted = formatPassageText("First line\nstill first.\n\nSecond paragraph.");

    expect(formatted).toBe("First line still first.\n\nSecond paragraph.");
  });
});

describe("MVP_PASSAGE_DISPLAY", () => {
  it("matches formatted passage text", () => {
    expect(MVP_PASSAGE_DISPLAY).toBe(formatPassageText(MVP_PASSAGE.text));
  });
});

describe("getPassageById", () => {
  it("returns MVP passage for lam-intro", () => {
    expect(getPassageById("lam-intro")).toBe(MVP_PASSAGE);
  });

  it("returns undefined for unknown ids", () => {
    expect(getPassageById("missing")).toBeUndefined();
  });
});
