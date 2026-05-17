export type SoundId =
  | "rr"
  | "ñ"
  | "ll"
  | "qu"
  | "ce"
  | "h"
  | "j"
  | "g"
  | "t"
  | "e"
  | "ó";

export type SoundRecommendation = {
  id: SoundId;
  label: string;
  tip: string;
};

const SOUND_PRIORITY: SoundId[] = [
  "rr",
  "ñ",
  "ll",
  "qu",
  "h",
  "ce",
  "j",
  "g",
  "t",
  "e",
  "ó",
];

const SOUND_META: Record<SoundId, { label: string; tip: string }> = {
  rr: {
    label: "rolled rr",
    tip: "Roll the double r with a quick tap of the tongue, like in “perro.”",
  },
  ñ: {
    label: "ñ",
    tip: "Pronounce ñ like the “ny” in “canyon,” not a plain “n.”",
  },
  ll: {
    label: "ll · y",
    tip: "In LATAM Spanish, ll often sounds like “y” in “yes” (e.g. llama = “YA-ma” not “LA-ma”).",
  },
  qu: {
    label: "qu",
    tip: "qu + e/i is a hard “k”—the u is silent, not English “kw” like “query.”",
  },
  ce: {
    label: "c + e/i",
    tip: "c before e or i sounds like “s” (cena, ciudad)—not the “k” in “cat.”",
  },
  h: {
    label: "silent h",
    tip: "Spanish h is always silent—never puff air like English “house.” (hola = OH-la)",
  },
  j: {
    label: "j",
    tip: "Soften j—similar to a breathy English “h”",
  },
  g: {
    label: "g",
    tip: "Before e or i, g is pronounced like the English “h”; elsewhere it stays a clear hard g.",
  },
  t: {
    label: "t · d",
    tip: 'Keep t crisp and dental—not a soft English “d.” Spanish d stays light, slightly closer to the English "th" than a heavy “duh.”',
  },
  e: {
    label: "e",
    tip: 'Spanish e is short, somewhere between the “eh” in “met” and the "ay" in "mate", not a long English “ee.”',
  },
  ó: {
    label: "ó · stress",
    tip: "Stress the marked syllable clearly—pitch and length carry the meaning.",
  },
};

const VOWEL = "[aeiouáéíóúü]";

function normalizeWord(word: string): string {
  return word
    .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "")
    .toLocaleLowerCase("es");
}

/** One primary sound per word, first matching rule wins. */
function inferSoundFromWord(raw: string): SoundId | null {
  const word = normalizeWord(raw);
  if (word.length < 2) return null;

  if (word.includes("rr")) return "rr";
  if (/^r/i.test(word)) return "rr";
  if (word.includes("ñ")) return "ñ";
  if (word.includes("ll")) return "ll";
  if (new RegExp(`${VOWEL}r${VOWEL}`, "i").test(word)) return "rr";

  if (/qu[eiéí]/i.test(word)) return "qu";
  if (/h/i.test(word)) return "h";
  if (/c[eiéí]/i.test(word)) return "ce";

  if (/j/i.test(word)) return "j";
  if (/g/i.test(word)) return "g";
  if (/t/i.test(word)) return "t";
  if (/d/i.test(word)) return "t";
  if (/e/i.test(word)) return "e";
  if (/[áéíóú]/.test(word)) return "ó";

  if (/[^aeiouáéíóúüns]$/i.test(word)) return "ó";

  return "ó";
}

function mismatchPercent(mismatchCount: number, totalWords: number): number {
  return Math.ceil((mismatchCount * 100) / totalWords);
}

/** Maps mismatch % (rounded up) to a score from 0–10. */
function scoreFromMismatchPercent(percent: number): number {
  if (percent >= 90) return 0;
  if (percent >= 50) return 1;
  if (percent >= 40) return 2;
  if (percent >= 30) return 3;
  if (percent >= 25) return 4;
  if (percent >= 20) return 5;
  if (percent >= 15) return 6;
  if (percent >= 10) return 7;
  if (percent >= 7) return 8;
  if (percent >= 1) return 9;
  return 10;
}

export function computePronunciationScore(
  mismatchCount: number,
  totalWords: number,
): number {
  if (totalWords <= 0) return 0;
  return scoreFromMismatchPercent(mismatchPercent(mismatchCount, totalWords));
}

export function getScoreLabel(score: number): string {
  if (score >= 10) return "Perfect!";
  if (score >= 8) return "Great!";
  if (score >= 6) return "Not bad!";
  if (score >= 4) return "Keep practicing!";
  if (score >= 1) return "Study up!";

  return "Try again 🙃";
}

export function getSoundRecommendations(
  mismatchedWords: string[],
): SoundRecommendation[] {
  const counts = new Map<SoundId, number>();

  for (const word of mismatchedWords) {
    const sound = inferSoundFromWord(word);
    if (!sound) continue;
    counts.set(sound, (counts.get(sound) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return SOUND_PRIORITY.indexOf(a[0]) - SOUND_PRIORITY.indexOf(b[0]);
    })
    .slice(0, 3)
    .map(([id]) => ({
      id,
      label: SOUND_META[id].label,
      tip: SOUND_META[id].tip,
    }));
}
