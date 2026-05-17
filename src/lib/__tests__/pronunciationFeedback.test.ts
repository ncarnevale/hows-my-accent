import { describe, expect, it } from "vitest";

import {
  computePronunciationScore,
  getScoreLabel,
  getSoundRecommendations,
  type SoundRecommendation,
} from "@/lib/pronunciationFeedback";

describe("computePronunciationScore", () => {
  it("returns 10 when there are no mismatches", () => {
    expect(computePronunciationScore(0, 100)).toBe(10);
    expect(computePronunciationScore(0, 60)).toBe(10);
  });

  it("maps mismatch bands for 100 total words", () => {
    expect(computePronunciationScore(1, 100)).toBe(9);
    expect(computePronunciationScore(6, 100)).toBe(9);
    expect(computePronunciationScore(7, 100)).toBe(8);
    expect(computePronunciationScore(9, 100)).toBe(8);
    expect(computePronunciationScore(10, 100)).toBe(7);
    expect(computePronunciationScore(14, 100)).toBe(7);
    expect(computePronunciationScore(15, 100)).toBe(6);
    expect(computePronunciationScore(19, 100)).toBe(6);
    expect(computePronunciationScore(20, 100)).toBe(5);
    expect(computePronunciationScore(24, 100)).toBe(5);
    expect(computePronunciationScore(25, 100)).toBe(4);
    expect(computePronunciationScore(29, 100)).toBe(4);
    expect(computePronunciationScore(30, 100)).toBe(3);
    expect(computePronunciationScore(39, 100)).toBe(3);
    expect(computePronunciationScore(40, 100)).toBe(2);
    expect(computePronunciationScore(49, 100)).toBe(2);
    expect(computePronunciationScore(50, 100)).toBe(1);
    expect(computePronunciationScore(89, 100)).toBe(1);
    expect(computePronunciationScore(90, 100)).toBe(0);
    expect(computePronunciationScore(100, 100)).toBe(0);
  });

  it("rounds mismatch percentage up for other passage lengths", () => {
    expect(computePronunciationScore(1, 60)).toBe(9);
    expect(computePronunciationScore(6, 60)).toBe(7);
    expect(computePronunciationScore(7, 60)).toBe(7);
    expect(computePronunciationScore(30, 60)).toBe(1);
  });

  it("returns 0 when mismatches exceed total words", () => {
    expect(computePronunciationScore(70, 60)).toBe(0);
  });

  it("returns 0 when totalWords is 0", () => {
    expect(computePronunciationScore(0, 0)).toBe(0);
  });
});

describe("getScoreLabel", () => {
  it("returns Perfect! for a score of 10", () => {
    expect(getScoreLabel(10)).toBe("Perfect!");
  });

  it("returns Great! for scores 8–9", () => {
    expect(getScoreLabel(9)).toBe("Great!");
    expect(getScoreLabel(8)).toBe("Great!");
  });

  it("returns Not bad! for scores 6–7", () => {
    expect(getScoreLabel(7)).toBe("Not bad!");
    expect(getScoreLabel(6)).toBe("Not bad!");
  });

  it("returns Keep practicing! for scores 4–5", () => {
    expect(getScoreLabel(5)).toBe("Keep practicing!");
    expect(getScoreLabel(4)).toBe("Keep practicing!");
  });

  it("returns Study up! for scores 1–3", () => {
    expect(getScoreLabel(3)).toBe("Study up!");
    expect(getScoreLabel(1)).toBe("Study up!");
  });

  it('returns "Try again" with upside-down face for score 0', () => {
    expect(getScoreLabel(0)).toBe("Try again 🙃");
  });
});

describe("getSoundRecommendations", () => {
  it("returns an empty list when there are no mismatches", () => {
    expect(getSoundRecommendations([])).toEqual([]);
  });

  it("infers rolled rr from double r", () => {
    const [rec] = getSoundRecommendations(["perro"]);

    expect(rec).toMatchObject({ id: "rr", label: expect.stringMatching(/rr/i) });
    expect(rec?.tip).toBeTruthy();
  });

  it("infers rr from word-initial r", () => {
    const [rec] = getSoundRecommendations(["rápido"]);

    expect(rec?.id).toBe("rr");
  });

  it("infers rr from intervocalic r", () => {
    const [rec] = getSoundRecommendations(["cero"]);

    expect(rec?.id).toBe("rr");
  });

  it("ranks sounds by frequency across mismatched words", () => {
    const recs = getSoundRecommendations([
      "perro",
      "carro",
      "mirra",
      "caña",
      "paño",
    ]);

    expect(recs[0]?.id).toBe("rr");
    expect(recs[1]?.id).toBe("ñ");
  });

  it("returns at most three recommendations", () => {
    const recs = getSoundRecommendations([
      "perro",
      "carro",
      "caña",
      "llama",
      "grande",
      "habló",
      "gira",
    ]);

    expect(recs).toHaveLength(3);
  });

  it("breaks ties using fixed sound priority", () => {
    const recs = getSoundRecommendations(["caña", "perro"]);

    expect(recs.map((r: SoundRecommendation) => r.id)).toEqual(["rr", "ñ"]);
  });

  it("infers ll, g, and j from spelling", () => {
    expect(getSoundRecommendations(["llama"])[0]?.id).toBe("ll");
    expect(getSoundRecommendations(["grande"])[0]?.id).toBe("g");
    expect(getSoundRecommendations(["viaje"])[0]?.id).toBe("j");
  });

  it("infers qu, soft c, silent h, t/d, and e for common English pitfalls", () => {
    expect(getSoundRecommendations(["que"])[0]?.id).toBe("qu");
    expect(getSoundRecommendations(["ciudad"])[0]?.id).toBe("ce");
    expect(getSoundRecommendations(["hola"])[0]?.id).toBe("h");
    expect(getSoundRecommendations(["hacer"])[0]?.id).toBe("h");
    expect(getSoundRecommendations(["tanto"])[0]?.id).toBe("t");
    expect(getSoundRecommendations(["debe"])[0]?.id).toBe("t");
    expect(getSoundRecommendations(["peso"])[0]?.id).toBe("e");
  });

  it("prefers qu before later rules in the same word", () => {
    expect(getSoundRecommendations(["queso"])[0]?.id).toBe("qu");
  });

  it("prefers accent stress over plain e", () => {
    expect(getSoundRecommendations(["café"])[0]?.id).toBe("ó");
  });

  it("defaults to stress for words without trickier spelling", () => {
    expect(getSoundRecommendations(["una"])[0]?.id).toBe("ó");
  });

  it("skips single-letter tokens", () => {
    expect(getSoundRecommendations(["y"])).toEqual([]);
  });
});
