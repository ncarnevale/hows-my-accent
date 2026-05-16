"use client";

import {
  RecordControlFooter,
  usePlayback,
} from "@/components/recorder/RecordControlFooter";
import { RecordToggleButton } from "@/components/recorder/RecordToggleButton";
import { RecordingWaveform } from "@/components/recorder/RecordingWaveform";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { usePlaybackUrl } from "@/hooks/usePlaybackUrl";

export type RecordControlProps = {
  onSubmit: (blob: Blob) => void;
};

export function RecordControl({ onSubmit }: RecordControlProps) {
  const { status, blob, stream, error, toggleRecording } = useAudioRecorder();
  const { audioRef, playRecording } = usePlayback();
  const playbackUrl = usePlaybackUrl(blob);

  const handleToggleRecord = () => {
    void toggleRecording();
  };

  const handleSubmit = () => {
    if (blob) onSubmit(blob);
  };

  let buttonLabel = "";
  let hint = "";

  switch (status) {
    case "idle":
      buttonLabel = "Record your pronunciation";
      hint = "Tap to record · stop when you finish reading";
      break;
    case "recording":
      buttonLabel = "Stop recording";
      hint = "Tap stop when you finish reading";
      break;
    case "recorded":
      buttonLabel = "Record again";
      hint = "Listen back, then submit when you're ready";
      break;
    case "error":
      buttonLabel = "Try again";
      hint = "Check browser permissions and try again";
      break;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <RecordToggleButton
        status={status}
        label={buttonLabel}
        onToggle={handleToggleRecord}
      />

      {status === "recording" && stream && (
        <RecordingWaveform stream={stream} />
      )}

      <RecordControlFooter
        status={status}
        hint={hint}
        error={error}
        playbackUrl={playbackUrl}
        audioRef={audioRef}
        onPlay={playRecording}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
