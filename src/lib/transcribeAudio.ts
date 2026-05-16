import { getOpenAIClient } from "@/lib/openai";

type WhisperTranscriptionClient = {
  audio: {
    transcriptions: {
      create: (params: {
        file: File;
        model: "whisper-1";
        language: "es";
      }) => Promise<{ text: string }>;
    };
  };
};

export async function transcribeAudio(
  audio: Blob,
  getClient: () => WhisperTranscriptionClient = getOpenAIClient,
): Promise<string> {
  const client = getClient();
  const file = new File([await audio.arrayBuffer()], "recording.webm", {
    type: audio.type || "audio/webm",
  });
  const { text } = await client.audio.transcriptions.create({
    file,
    model: "whisper-1",
    language: "es",
  });
  return text;
}
