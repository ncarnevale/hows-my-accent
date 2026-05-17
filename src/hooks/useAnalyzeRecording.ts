"use client";

import { useCallback, useState } from "react";

import { analyzeRecording } from "@/lib/analyzeClient";
import type { AnalyzeResponse } from "@/types/pronunciation";

type AnalyzeStatus = "idle" | "loading" | "success" | "error";

export function useAnalyzeRecording(passageId: string) {
  const [status, setStatus] = useState<AnalyzeStatus>("idle");
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const submit = useCallback(
    async (blob: Blob): Promise<"success" | "error"> => {
      setStatus("loading");
      setError(null);
      setResult(null);
      try {
        const data = await analyzeRecording(blob, passageId);
        setResult(data);
        setStatus("success");
        return "success";
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)));
        setStatus("error");
        return "error";
      }
    },
    [passageId],
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setError(null);
  }, []);

  return { status, result, error, submit, reset };
}
