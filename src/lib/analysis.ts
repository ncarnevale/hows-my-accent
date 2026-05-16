import { compareTranscriptToPassage } from "@/lib/compareTranscript";
import { formatPassageText, getPassageById } from "@/lib/passages";
import { transcribeAudio } from "@/lib/transcribeAudio";
import type { AnalyzeResponse } from "@/types/pronunciation";

export async function analyzePronunciation(
  audio: Blob,
  passageId: string,
): Promise<AnalyzeResponse> {
  const passage = getPassageById(passageId);
  if (!passage) {
    throw new Error("Unknown passage");
  }

  const transcript = await transcribeAudio(audio);
  const expectedPassage = formatPassageText(passage.text);
  const mismatchedWords = compareTranscriptToPassage(
    expectedPassage,
    transcript,
  );

  return { transcript, mismatchedWords };
}
