"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { getSupportedMimeType } from "@/lib/audio";

export type RecordingStatus = "idle" | "recording" | "recorded" | "error";

const MIC_DENIED_MESSAGE =
  "Microphone access was denied. Allow microphone access in your browser settings and try again.";

function stopStreamTracks(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

export function useAudioRecorder() {
  const mimeType = getSupportedMimeType();
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [status, setStatus] = useState<RecordingStatus>("idle");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const releaseResources = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }
    recorderRef.current = null;
    stopStreamTracks(streamRef.current);
    streamRef.current = null;
    chunksRef.current = [];
  }, []);

  const reset = useCallback(() => {
    releaseResources();
    setStream(null);
    setBlob(null);
    setError(null);
    setStatus("idle");
  }, [releaseResources]);

  const stopRecording = useCallback(() => {
    if (status !== "recording") return;
    recorderRef.current?.stop();
  }, [status]);

  const startRecording = useCallback(async () => {
    if (status === "recording") return;

    setError(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      streamRef.current = mediaStream;
      chunksRef.current = [];
      setStream(mediaStream);
      setBlob(null);

      const recorder = new MediaRecorder(mediaStream, { mimeType });
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const recordedBlob = new Blob(chunksRef.current, { type: mimeType });
        releaseResources();
        setStream(null);
        setBlob(recordedBlob);
        setStatus("recorded");
      };

      recorder.start();
      setStatus("recording");
    } catch {
      reset();
      setError(MIC_DENIED_MESSAGE);
      setStatus("error");
    }
  }, [mimeType, releaseResources, reset, status]);

  const toggleRecording = useCallback(async () => {
    if (status === "idle" || status === "error") {
      await startRecording();
      return;
    }

    if (status === "recording") {
      stopRecording();
      return;
    }

    reset();
    await startRecording();
  }, [reset, startRecording, status, stopRecording]);

  useEffect(() => () => releaseResources(), [releaseResources]);

  return {
    status,
    blob,
    stream,
    error,
    mimeType,
    startRecording,
    stopRecording,
    reset,
    toggleRecording,
  };
}
