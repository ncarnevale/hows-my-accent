import { describe, expect, it } from "vitest";

import { MVP_PASSAGE } from "@/data/passages";
import {
  MVP_PASSAGE_DISPLAY,
  MVP_PASSAGE_WORD_COUNT,
  countPassageWords,
  formatPassageText,
  getPassageById,
} from "@/lib/passages";

describe("formatPassageText", () => {
  it("collapses source line wraps into a single flowing paragraph", () => {
    const formatted = formatPassageText(MVP_PASSAGE.text);

    expect(formatted).not.toMatch(/\n(?!\n)/);
    expect(formatted).toContain("Una olla grande");
    expect(formatted).toContain("que mundo loquísimo.");
    expect(formatted).not.toContain("café\nde");
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

describe("countPassageWords", () => {
  it("returns 0 for empty or whitespace-only text", () => {
    expect(countPassageWords("")).toBe(0);
    expect(countPassageWords("   ")).toBe(0);
  });

  it("counts words split on whitespace", () => {
    expect(countPassageWords("uno dos tres")).toBe(3);
    expect(countPassageWords("  uno   dos  tres  ")).toBe(3);
  });
});

describe("MVP_PASSAGE_WORD_COUNT", () => {
  it("matches countPassageWords for the formatted MVP passage", () => {
    expect(MVP_PASSAGE_WORD_COUNT).toBe(countPassageWords(MVP_PASSAGE_DISPLAY));
  });

  it("is about 60 words for the current MVP passage", () => {
    expect(MVP_PASSAGE_WORD_COUNT).toBeGreaterThanOrEqual(55);
    expect(MVP_PASSAGE_WORD_COUNT).toBeLessThanOrEqual(65);
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
