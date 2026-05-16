import { MVP_PASSAGE, PASSAGES } from "@/data/passages";

/** Collapses source line-wraps into flowing text; blank lines become paragraph breaks. */
export function formatPassageText(text: string): string {
  return text
    .trim()
    .split(/\n\s*\n/)
    .map((paragraph) =>
      paragraph
        .replace(/\s*\n\s*/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .join("\n\n");
}

export const MVP_PASSAGE_DISPLAY = formatPassageText(MVP_PASSAGE.text);

export function getPassageById(id: string) {
  return PASSAGES.find((passage) => passage.id === id);
}
