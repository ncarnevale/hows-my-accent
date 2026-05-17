import { tokenizePassageWords } from "@/lib/passageTokens";

function tokenizePassage(passage: string): { original: string; normalized: string }[] {
  return tokenizePassageWords(passage).map((original) => ({
    original,
    normalized: normalizeToken(original),
  }));
}

const N_TILDE_PLACEHOLDER = "\uE000";

function stripVowelAccents(token: string): string {
  return token
    .replace(/ñ/g, N_TILDE_PLACEHOLDER)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll(N_TILDE_PLACEHOLDER, "ñ");
}

function stripEdgePunctuation(token: string): string {
  return token.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/u, "");
}

function normalizeToken(token: string): string {
  return stripVowelAccents(stripEdgePunctuation(token).toLocaleLowerCase("es"));
}

function toDisplayToken(token: string): string {
  return stripEdgePunctuation(token).toLocaleLowerCase("es");
}

function finalizeMismatches(words: string[]): string[] {
  return [...new Set(words)].sort((a, b) => a.localeCompare(b, "es"));
}

export function compareTranscriptToPassage(
  expectedPassage: string,
  transcript: string,
): string[] {
  const expectedTokens = tokenizePassage(expectedPassage);
  const transcriptTokens = tokenizePassage(transcript);
  const mismatchedWords: string[] = [];

  for (let i = 0; i < expectedTokens.length; i++) {
    const expected = expectedTokens[i];
    const actual = transcriptTokens[i];

    if (!actual || expected.normalized !== actual.normalized) {
      mismatchedWords.push(toDisplayToken(expected.original));
    }
  }

  return finalizeMismatches(mismatchedWords);
}
