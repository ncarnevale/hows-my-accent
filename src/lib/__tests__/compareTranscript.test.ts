import { describe, expect, it } from "vitest";

import { compareTranscriptToPassage } from "@/lib/compareTranscript";

describe("compareTranscriptToPassage", () => {
  it("returns no mismatches when transcript matches expected passage", () => {
    const passage = "Un perro grande corre rápido";

    expect(compareTranscriptToPassage(passage, passage)).toEqual([]);
  });

  it("flags expected word when transcript differs (perro vs pero)", () => {
    const expected = "Un perro grande";
    const transcript = "Un pero grande";

    expect(compareTranscriptToPassage(expected, transcript)).toEqual(["perro"]);
  });

  it("ignores case and leading or trailing punctuation differences", () => {
    const expected = "Queridos, amigos!";
    const transcript = "queridos amigos";

    expect(compareTranscriptToPassage(expected, transcript)).toEqual([]);
  });

  it("preserves Unicode letters such as ñ and accented characters when comparing", () => {
    const expected = "La niña caminó";
    const transcript = "la niña camino";

    expect(compareTranscriptToPassage(expected, transcript)).toEqual([
      "caminó",
    ]);
  });

  it("lists remaining expected words when transcript is shorter", () => {
    const expected = "uno dos tres cuatro";
    const transcript = "uno dos";

    expect(compareTranscriptToPassage(expected, transcript)).toEqual([
      "tres",
      "cuatro",
    ]);
  });

  it("ignores extra transcript words beyond the expected length", () => {
    const expected = "uno dos";
    const transcript = "uno dos tres cuatro";

    expect(compareTranscriptToPassage(expected, transcript)).toEqual([]);
  });

  it("flags all expected words when transcript is empty", () => {
    const expected = "hola mundo";

    expect(compareTranscriptToPassage(expected, "")).toEqual(["hola", "mundo"]);
  });
});
