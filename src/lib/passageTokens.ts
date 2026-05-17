/** Whitespace tokenization shared by passage word count and transcript compare. */
export function tokenizePassageWords(passage: string): string[] {
  return passage
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}
