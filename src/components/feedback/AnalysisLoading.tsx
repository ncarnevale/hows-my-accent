"use client";

import { cn } from "@/lib/utils";

const BAR_COUNT = 20;

export function AnalysisLoading() {
  return (
    <div
      className="flex w-full flex-col items-center justify-center gap-8 py-12 text-center"
      role="status"
      aria-busy="true"
      aria-label="Analyzing your pronunciation"
    >
      <div
        aria-hidden
        className="flex h-10 items-end justify-center gap-1"
      >
        {Array.from({ length: BAR_COUNT }, (_, index) => (
          <span
            key={index}
            data-waveform-bar
            className={cn(
              "w-1 min-h-[3px] rounded-full animate-pulse",
              index % 2 === 0 ? "bg-terracotta" : "bg-marigold"
            )}
            style={{
              height: `${28 + (index % 6) * 10}%`,
              animationDelay: `${(index % 5) * 0.12}s`,
              animationDuration: "1.1s",
            }}
          />
        ))}
      </div>
      <p className="max-w-sm text-lg font-medium text-foreground">
        Analyzing your pronunciation...
      </p>
    </div>
  );
}
