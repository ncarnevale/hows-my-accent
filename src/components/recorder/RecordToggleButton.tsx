"use client";

import { Mic, Square } from "lucide-react";

import type { RecordingStatus } from "@/hooks/useAudioRecorder";
import { cn } from "@/lib/utils";

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

export function RecordToggleButton({
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
