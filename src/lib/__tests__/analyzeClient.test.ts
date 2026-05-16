import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { analyzeRecording } from "@/lib/analyzeClient";
import type { AnalyzeResponse } from "@/types/pronunciation";

const mockResponse: AnalyzeResponse = {
  transcript: "Hola mundo",
  mismatchedWords: ["perro"],
};

describe("analyzeRecording", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts audio and passageId to /api/analyze and returns JSON", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(mockResponse), { status: 200 }),
    );
    const blob = new Blob(["audio"], { type: "audio/webm" });

    const result = await analyzeRecording(blob, "lam-intro");

    expect(result).toEqual(mockResponse);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/analyze");
    expect(init.method).toBe("POST");
    const body = init.body as FormData;
    expect(body.get("passageId")).toBe("lam-intro");
    const audio = body.get("audio");
    expect(audio).toBeInstanceOf(Blob);
    expect((audio as Blob).type).toBe("audio/webm");
    expect((audio as Blob).size).toBe(blob.size);
  });

  it("throws when the response is not ok", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ error: "Missing audio" }), { status: 400 }),
    );
    const blob = new Blob(["audio"], { type: "audio/webm" });

    await expect(analyzeRecording(blob, "lam-intro")).rejects.toThrow();
  });
});
