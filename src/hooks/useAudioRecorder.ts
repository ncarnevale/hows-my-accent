"use client";

import { useRef, useState } from "react";

import { getSupportedMimeType } from "@/lib/audio";

// MediaRecorder: record -> stop -> blob in memory (no persistence).
export function useAudioRecorder() {
  const recorder = useRef<MediaRecorder | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  return { blob, recorder, mimeType: getSupportedMimeType(), setBlob };
}
