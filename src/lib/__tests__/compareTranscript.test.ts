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

  it("ignores vowel accent differences when comparing", () => {
    const expected = "La niña caminó rápido";
    const transcript = "la niña camino rapido";

    expect(compareTranscriptToPassage(expected, transcript)).toEqual([]);
  });

  it("still treats ñ as distinct from n", () => {
    const expected = "La niña caminó";
    const transcript = "la nina camino";

    expect(compareTranscriptToPassage(expected, transcript)).toEqual(["niña"]);
  });

  it("returns lowercased passage spelling with accents preserved on mismatches", () => {
    const expected = "Él caminó ayer";
    const transcript = "ella camina mañana";

    expect(compareTranscriptToPassage(expected, transcript)).toEqual([
      "ayer",
      "caminó",
      "él",
    ]);
  });

  it("lowercases capitalized expected words in results", () => {
    const expected = "Cera del sur";
    const transcript = "sera del sur";

    expect(compareTranscriptToPassage(expected, transcript)).toEqual(["cera"]);
  });

  it("dedupes and alphabetizes mismatched words", () => {
    const expected = "perro come perro";
    const transcript = "pero come pero";

    expect(compareTranscriptToPassage(expected, transcript)).toEqual(["perro"]);
  });

  it("alphabetizes mismatches from positional compare", () => {
    const expected = "zebra alpha beta";
    const transcript = "zebra wrong gamma";

    expect(compareTranscriptToPassage(expected, transcript)).toEqual([
      "alpha",
      "beta",
    ]);
  });

  it("lists remaining expected words when transcript is shorter", () => {
    const expected = "uno dos tres cuatro";
    const transcript = "uno dos";

    expect(compareTranscriptToPassage(expected, transcript)).toEqual([
      "cuatro",
      "tres",
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
