import { StepIndicator } from "@/components/landing/StepIndicator";

export function ReadingPromptHeader() {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <StepIndicator color="terracotta" stepNumber={1} text="Read aloud" />
      <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Take a breath, then read at your{" "}
        <span className="font-serif font-medium text-terracotta">
          natural pace
        </span>
        .
      </h2>
      <p className="max-w-md text-balance text-sm text-muted-foreground">
        Don&apos;t aim for perfection — we&apos;ll listen for the tricky sounds
        and give you a friendly nudge.
      </p>
    </div>
  );
}
