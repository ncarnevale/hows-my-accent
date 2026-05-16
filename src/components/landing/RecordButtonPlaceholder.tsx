import { Mic } from "lucide-react";

import { cn } from "@/lib/utils";

export function RecordButtonPlaceholder() {
  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        disabled
        aria-label="Record your pronunciation (coming soon)"
        className={cn(
          "flex size-24 items-center justify-center rounded-full",
          "bg-primary text-primary-foreground shadow-lg",
          "cursor-not-allowed opacity-60",
          "ring-4 ring-primary/20"
        )}
      >
        <Mic className="size-10" strokeWidth={1.75} />
      </button>
      <p className="text-sm text-muted-foreground">Recording coming soon</p>
    </div>
  );
}
