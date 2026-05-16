import { beforeEach, describe, expect, it, vi } from "vitest";

import { transcribeAudio } from "@/lib/transcribeAudio";

describe("transcribeAudio", () => {
  const mockCreate = vi.fn<
    (params: {
      file: File;
      model: "whisper-1";
      language: "es";
    }) => Promise<{ text: string }>
  >();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends webm audio to Whisper and returns transcript text", async () => {
    mockCreate.mockResolvedValue({ text: "hola mundo" });
    const audio = new Blob(["audio"], { type: "audio/webm" });

    const text = await transcribeAudio(audio, () => ({
      audio: { transcriptions: { create: mockCreate } },
    }));

    expect(text).toBe("hola mundo");
    expect(mockCreate).toHaveBeenCalledWith({
      file: expect.any(File),
      model: "whisper-1",
      language: "es",
    });
    const { file } = mockCreate.mock.calls[0][0];
    expect(file).toBeInstanceOf(File);
    expect(file.name).toBe("recording.webm");
    expect(file.type).toBe("audio/webm");
  });
});
