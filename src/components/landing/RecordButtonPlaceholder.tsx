import { Mic } from "lucide-react";

import { cn } from "@/lib/utils";

export function RecordButtonPlaceholder() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-terracotta/35 animate-halo-pulse"
        />
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-marigold/30 animate-halo-pulse-delayed"
        />

        <button
          type="button"
          disabled
          aria-label="Record your pronunciation (coming soon)"
          className={cn(
            "relative grid size-28 place-items-center rounded-full",
            "bg-linear-to-br from-terracotta via-[oklch(0.65_0.18_45)] to-marigold",
            "text-primary-foreground shadow-lg shadow-terracotta/30",
            "ring-1 ring-foreground/8",
            "cursor-not-allowed opacity-90 transition-transform"
          )}
        >
          <Mic className="size-10" strokeWidth={1.75} />
        </button>
      </div>

      <div className="flex flex-col items-center gap-1">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/70 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground backdrop-blur-sm">
          <span className="size-1.5 rounded-full bg-marigold" />
          Recording coming soon
        </span>
        <p className="text-xs text-muted-foreground/80">
          Tap to record · stop when you finish reading
        </p>
      </div>
    </div>
  );
}
