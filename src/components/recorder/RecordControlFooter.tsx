"use client";

import { Play } from "lucide-react";
import { useRef, type RefObject } from "react";

import type { RecordingStatus } from "@/hooks/useAudioRecorder";
import { cn } from "@/lib/utils";

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

export function RecordControlFooter({
  status,
  hint,
  error,
  playbackUrl,
  audioRef,
  onPlay,
  onSubmit,
}: {
  status: RecordingStatus;
  hint: string;
  error: string | null;
  playbackUrl: string | null;
  audioRef: RefObject<HTMLAudioElement | null>;
  onPlay: () => void;
  onSubmit: () => void;
}) {
  const showPlayback = status === "recorded" && playbackUrl;
  const showSubmit = status === "recorded";

  return (
    <div className="flex flex-col items-center gap-2">
      {showPlayback && (
        <PlaybackControls
          playbackUrl={playbackUrl}
          audioRef={audioRef}
          onPlay={onPlay}
        />
      )}

      {showSubmit && (
        <button
          type="button"
          onClick={onSubmit}
          className={cn(
            "inline-flex items-center justify-center rounded-full",
            "bg-foreground px-6 py-2.5 text-sm font-semibold text-background",
            "shadow-sm transition-colors hover:bg-foreground/90",
          )}
        >
          Submit recording
        </button>
      )}

      {status === "error" && error && (
        <p className="max-w-xs text-center text-sm text-destructive">{error}</p>
      )}

      <p className="text-xs text-muted-foreground/80">{hint}</p>
    </div>
  );
}

export function usePlayback() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const playRecording = () => {
    void Promise.resolve(audioRef.current?.play()).catch(() => {});
  };

  return { audioRef, playRecording };
}
