function tokenizePassage(passage: string): { original: string; normalized: string }[] {
  return passage
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((original) => ({
      original,
      normalized: normalizeToken(original),
    }));
}

function normalizeToken(token: string): string {
  return token.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/u, "");
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
      mismatchedWords.push(expected.original);
    }
  }

  return mismatchedWords;
}
