"use client";

import { Pause, Play } from "lucide-react";
import type { Ref } from "react";

import type { RecordingStatus } from "@/hooks/useAudioRecorder";
import { cn } from "@/lib/utils";

type TypeRecordControlFooterProps = {
  status: RecordingStatus;
  hint: string;
  error: string | null;
  playbackUrl: string | null;
  audioRef: Ref<HTMLAudioElement | null>;
  isPlaying: boolean;
  onPlaybackToggle: () => void;
  onTryAgain: () => void;
  onSubmit: () => void;
};

export function RecordControlFooter({
  status,
  hint,
  error,
  playbackUrl,
  audioRef,
  isPlaying,
  onPlaybackToggle,
  onTryAgain,
  onSubmit,
}: TypeRecordControlFooterProps) {
  const showPlayback = status === "recorded" && playbackUrl;
  const showActions = status === "recorded";

  return (
    <div className="flex flex-col items-center gap-2">
      {showPlayback && playbackUrl && (
        <PlaybackControls
          playbackUrl={playbackUrl}
          audioRef={audioRef}
          isPlaying={isPlaying}
          onToggle={onPlaybackToggle}
        />
      )}

      {showActions && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onTryAgain}
            aria-label="Try again"
            className={cn(
              "inline-flex items-center justify-center rounded-full border border-border/70",
              "bg-card/80 px-4 py-2.5 text-sm font-medium text-foreground",
              "shadow-sm backdrop-blur-sm transition-colors",
              "hover:bg-card hover:border-terracotta/30",
            )}
          >
            Try again
          </button>
          <button
            type="button"
            onClick={onSubmit}
            aria-label="Submit recording"
            className={cn(
              "inline-flex items-center justify-center rounded-full",
              "bg-terracotta px-6 py-2.5 text-sm font-semibold text-background",
              "shadow-sm transition-colors hover:bg-foreground/90",
            )}
          >
            Submit
          </button>
        </div>
      )}

      {status === "error" && error && (
        <p className="max-w-xs text-center text-sm text-destructive">{error}</p>
      )}

      <p className="text-xs text-muted-foreground/80">{hint}</p>
    </div>
  );
}

function PlaybackControls({
  playbackUrl,
  audioRef,
  isPlaying,
  onToggle,
}: {
  playbackUrl: string;
  audioRef: Ref<HTMLAudioElement | null>;
  isPlaying: boolean;
  onToggle: () => void;
}) {
  const label = isPlaying ? "Pause recording" : "Play recording";

  return (
    <>
      <audio ref={audioRef} src={playbackUrl} className="sr-only" />
      <button
        type="button"
        onClick={onToggle}
        aria-label={label}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-border/70",
          "bg-card/80 px-4 py-2 text-sm font-medium text-foreground",
          "shadow-sm backdrop-blur-sm transition-colors",
          "hover:bg-card hover:border-terracotta/30",
        )}
      >
        {isPlaying ? (
          <Pause className="size-4 fill-current" strokeWidth={0} />
        ) : (
          <Play className="size-4 fill-terracotta text-terracotta" />
        )}
        {label}
      </button>
    </>
  );
}
