import type { AnalyzeResponse } from "@/types/pronunciation";

export async function analyzeRecording(
  blob: Blob,
  passageId: string,
): Promise<AnalyzeResponse> {
  const formData = new FormData();
  formData.append("audio", blob);
  formData.append("passageId", passageId);

  const response = await fetch("/api/analyze", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Analyze failed: ${response.status}`);
  }

  return response.json() as Promise<AnalyzeResponse>;
}
