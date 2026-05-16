import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAnalyzeRecording } from "@/hooks/useAnalyzeRecording";
import { analyzeRecording } from "@/lib/analyzeClient";
import type { AnalyzeResponse } from "@/types/pronunciation";

vi.mock("@/lib/analyzeClient", () => ({
  analyzeRecording: vi.fn(),
}));

const mockResponse: AnalyzeResponse = {
  transcript: "Hola mundo",
  mismatchedWords: ["perro"],
};

describe("useAnalyzeRecording", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("starts idle with no result or error", () => {
    const { result } = renderHook(() => useAnalyzeRecording("lam-intro"));

    expect(result.current.status).toBe("idle");
    expect(result.current.result).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("submit sets loading then success with the API result", async () => {
    let resolveAnalyze!: (value: AnalyzeResponse) => void;
    vi.mocked(analyzeRecording).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveAnalyze = resolve;
        }),
    );
    const { result } = renderHook(() => useAnalyzeRecording("lam-intro"));
    const blob = new Blob(["audio"], { type: "audio/webm" });

    act(() => {
      void result.current.submit(blob);
    });
    expect(result.current.status).toBe("loading");

    await act(async () => {
      resolveAnalyze(mockResponse);
    });

    expect(result.current.status).toBe("success");
    expect(result.current.result).toEqual(mockResponse);
    expect(result.current.error).toBeNull();
    expect(analyzeRecording).toHaveBeenCalledWith(blob, "lam-intro");
  });

  it("submit sets error when analyzeRecording rejects", async () => {
    vi.mocked(analyzeRecording).mockRejectedValue(new Error("Analyze failed"));
    const { result } = renderHook(() => useAnalyzeRecording("lam-intro"));
    const blob = new Blob(["audio"], { type: "audio/webm" });

    await act(async () => {
      await result.current.submit(blob);
    });

    expect(result.current.status).toBe("error");
    expect(result.current.result).toBeNull();
    expect(result.current.error).toEqual(new Error("Analyze failed"));
  });

  it("reset returns to idle and clears result and error", async () => {
    vi.mocked(analyzeRecording).mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useAnalyzeRecording("lam-intro"));
    const blob = new Blob(["audio"], { type: "audio/webm" });

    await act(async () => {
      await result.current.submit(blob);
    });
    await waitFor(() => {
      expect(result.current.status).toBe("success");
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.status).toBe("idle");
    expect(result.current.result).toBeNull();
    expect(result.current.error).toBeNull();
  });
});
