"use client";

import { useEffect, useMemo } from "react";

import { ReadingPromptHeader } from "@/components/landing/ReadingPromptHeader";
import { ReadingPromptPassage } from "@/components/landing/ReadingPromptPassage";
import { RecordControl } from "@/components/recorder/RecordControl";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";

export function ReadingPrompt() {
  const { status, blob, stream, error, toggleRecording, reset } =
    useAudioRecorder();

  const playbackUrl = useMemo(
    () => (blob ? URL.createObjectURL(blob) : null),
    [blob],
  );

  useEffect(
    () => () => {
      if (playbackUrl) URL.revokeObjectURL(playbackUrl);
    },
    [playbackUrl],
  );

  const handleToggleRecord = () => {
    void toggleRecording();
  };

  return (
    <div className="flex w-full flex-col gap-10">
      <ReadingPromptHeader />
      <ReadingPromptPassage />
      <RecordControl
        status={status}
        stream={stream}
        playbackUrl={playbackUrl}
        error={error}
        onToggleRecord={handleToggleRecord}
        onPlay={() => {}}
        onReset={reset}
      />
    </div>
  );
}
