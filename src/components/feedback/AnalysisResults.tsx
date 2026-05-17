"use client";

import { Button } from "@/components/ui/button";

export type AnalysisResultsProps = {
  words: string[];
  onBack?: () => void;
};

export function AnalysisResults({ words, onBack }: AnalysisResultsProps) {
  const hasMismatches = words.length > 0;

  return (
    <div className="flex w-full flex-col items-center gap-8 py-8 text-center">
      <div className="flex w-full flex-col gap-4">
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Pronunciation results
        </h2>

        {hasMismatches ? (
          <ul className="mx-auto flex max-w-sm flex-col gap-2 text-left">
            {words.map((word, index) => (
              <li
                key={`${word}-${index}`}
                className="rounded-lg border border-border/70 bg-card/60 px-4 py-2.5 font-medium text-foreground backdrop-blur-sm"
              >
                {word}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No mismatches detected</p>
        )}
      </div>

      {onBack ? (
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      ) : null}
    </div>
  );
}
