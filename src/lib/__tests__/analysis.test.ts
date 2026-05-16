import { beforeEach, describe, expect, it, vi } from "vitest";

import { MVP_PASSAGE } from "@/data/passages";
import { analyzePronunciation } from "@/lib/analysis";
import { MVP_PASSAGE_DISPLAY } from "@/lib/passages";
import { transcribeAudio } from "@/lib/transcribeAudio";

vi.mock("@/lib/transcribeAudio", () => ({
  transcribeAudio: vi.fn(),
}));

describe("analyzePronunciation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns transcript and no mismatches when Whisper matches the passage", async () => {
    vi.mocked(transcribeAudio).mockResolvedValue(MVP_PASSAGE_DISPLAY);
    const audio = new Blob(["audio"], { type: "audio/webm" });

    const result = await analyzePronunciation(audio, MVP_PASSAGE.id);

    expect(result).toEqual({
      transcript: MVP_PASSAGE_DISPLAY,
      mismatchedWords: [],
    });
    expect(transcribeAudio).toHaveBeenCalledWith(audio);
  });

  it("returns mismatched expected words when transcript differs", async () => {
    const transcript = MVP_PASSAGE_DISPLAY.replace("perro", "pero");
    vi.mocked(transcribeAudio).mockResolvedValue(transcript);
    const audio = new Blob(["audio"], { type: "audio/webm" });

    const result = await analyzePronunciation(audio, MVP_PASSAGE.id);

    expect(result.transcript).toBe(transcript);
    expect(result.mismatchedWords).toEqual(["perro"]);
  });

  it("rejects when passage id is unknown", async () => {
    const audio = new Blob(["audio"], { type: "audio/webm" });

    await expect(
      analyzePronunciation(audio, "unknown-passage"),
    ).rejects.toThrow("Unknown passage");
    expect(transcribeAudio).not.toHaveBeenCalled();
  });
});
