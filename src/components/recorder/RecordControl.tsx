"use client";

import { Mic, Play, Square } from "lucide-react";
import { useRef, type RefObject } from "react";

import { RecordingWaveform } from "@/components/recorder/RecordingWaveform";
import type { RecordingStatus } from "@/hooks/useAudioRecorder";
import { cn } from "@/lib/utils";

export type RecordControlProps = {
  status: RecordingStatus;
  stream: MediaStream | null;
  playbackUrl: string | null;
  error: string | null;
  onToggleRecord: () => void;
  onPlay: () => void;
  onReset?: () => void;
};

export function RecordControl({
  status,
  stream,
  playbackUrl,
  error,
  onToggleRecord,
  onPlay,
}: RecordControlProps) {
  const { audioRef, playRecording } = usePlayback(onPlay);

  let buttonLabel: string = "";
  let hint: string = "";

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
      hint = "Listen back, or tap the mic to re-record";
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
        onToggle={onToggleRecord}
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
      />
    </div>
  );
}

function usePlayback(onPlay: () => void) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const playRecording = () => {
    void Promise.resolve(audioRef.current?.play()).catch(() => {});
    onPlay();
  };

  return { audioRef, playRecording };
}

function RecordButtonHalo({ status }: { status: RecordingStatus }) {
  if (status === "recording") {
    return (
      <span
        aria-hidden
        className="absolute inset-0 rounded-full border-2 border-terracotta/50 animate-pulse"
      />
    );
  }

  if (status === "error") return null;

  return (
    <>
      <span
        aria-hidden
        className="absolute inset-0 rounded-full bg-terracotta/35 animate-halo-pulse"
      />
      <span
        aria-hidden
        className="absolute inset-0 rounded-full bg-marigold/30 animate-halo-pulse-delayed"
      />
    </>
  );
}

function RecordToggleButton({
  status,
  label,
  onToggle,
}: {
  status: RecordingStatus;
  label: string;
  onToggle: () => void;
}) {
  const isRecording = status === "recording";

  return (
    <div className="relative">
      <RecordButtonHalo status={status} />

      <button
        type="button"
        onClick={onToggle}
        aria-label={label}
        className={cn(
          "relative grid size-28 place-items-center rounded-full",
          "bg-linear-to-br from-terracotta via-[oklch(0.65_0.18_45)] to-marigold",
          "text-primary-foreground shadow-lg shadow-terracotta/30",
          "ring-1 ring-foreground/8",
          "transition-transform hover:scale-[1.02] active:scale-[0.98]",
          isRecording &&
            "from-foreground/80 via-foreground/70 to-foreground/60",
        )}
      >
        {isRecording ? (
          <Square className="size-9 fill-current" strokeWidth={0} />
        ) : (
          <Mic className="size-10" strokeWidth={1.75} />
        )}
      </button>
    </div>
  );
}

function PlaybackControls({
  playbackUrl,
  audioRef,
  onPlay,
}: {
  playbackUrl: string;
  audioRef: RefObject<HTMLAudioElement | null>;
  onPlay: () => void;
}) {
  return (
    <>
      <audio ref={audioRef} src={playbackUrl} className="sr-only" />
      <button
        type="button"
        onClick={onPlay}
        aria-label="Play recording"
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-border/70",
          "bg-card/80 px-4 py-2 text-sm font-medium text-foreground",
          "shadow-sm backdrop-blur-sm transition-colors",
          "hover:bg-card hover:border-terracotta/30",
        )}
      >
        <Play className="size-4 fill-terracotta text-terracotta" />
        Play recording
      </button>
    </>
  );
}

function RecordControlFooter({
  status,
  hint,
  error,
  playbackUrl,
  audioRef,
  onPlay,
}: {
  status: RecordingStatus;
  hint: string;
  error: string | null;
  playbackUrl: string | null;
  audioRef: RefObject<HTMLAudioElement | null>;
  onPlay: () => void;
}) {
  const showPlayback = status === "recorded" && playbackUrl;

  return (
    <div className="flex flex-col items-center gap-2">
      {showPlayback && (
        <PlaybackControls
          playbackUrl={playbackUrl}
          audioRef={audioRef}
          onPlay={onPlay}
        />
      )}

      {status === "error" && error && (
        <p className="max-w-xs text-center text-sm text-destructive">{error}</p>
      )}

      <p className="text-xs text-muted-foreground/80">{hint}</p>
    </div>
  );
}
