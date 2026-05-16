import type { AnalyzeResponse } from "@/types/pronunciation";

// Whisper transcription + heuristic compare vs expected passage (see MVP_SPEC).
export async function analyzePronunciation(
  _audio: Blob,
  _passageId: string,
): Promise<AnalyzeResponse> {
  throw new Error("Not implemented");
}
