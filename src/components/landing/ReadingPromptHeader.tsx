import { StepIndicator } from "@/components/landing/StepIndicator";

export function ReadingPromptHeader() {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Take a breath, then read the following{" "}
        <span className="font-serif font-medium text-terracotta">slowly</span>{" "}
        and{" "}
        <span className="font-serif font-medium text-terracotta">
          naturally
        </span>
        .
      </h2>
      <p className="max-w-md text-balance text-sm text-muted-foreground">
        Don&apos;t worry too much, you can always retry if you're unhappy with
        the first recording.
      </p>
    </div>
  );
}
