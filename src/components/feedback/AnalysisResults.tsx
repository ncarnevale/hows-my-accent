"use client";

import { Button } from "@/components/ui/button";
import { MVP_PASSAGE_WORD_COUNT } from "@/lib/passages";
import {
  computePronunciationScore,
  getScoreLabel,
  getSoundRecommendations,
} from "@/lib/pronunciationFeedback";

export type AnalysisResultsProps = {
  words: string[];
  totalWords?: number;
  onBack?: () => void;
};

export function AnalysisResults({
  words,
  totalWords = MVP_PASSAGE_WORD_COUNT,
  onBack,
}: AnalysisResultsProps) {
  const score = computePronunciationScore(words.length, totalWords);
  const label = getScoreLabel(score);
  const recommendations = getSoundRecommendations(words);
  const isPerfect = score >= 10;

  return (
    <div className="flex w-full flex-col items-center gap-8 py-8 text-center">
      <div className="flex w-full flex-col gap-6">
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Pronunciation results
        </h2>

        <div className="flex flex-col gap-1">
          <p
            className="font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl"
            aria-label={`${score} out of 10, ${label}`}
          >
            {score} / 10
            <span className="text-muted-foreground"> · </span>
            <span className="text-2xl font-medium sm:text-3xl">{label}</span>
          </p>
        </div>

        {isPerfect ? (
          <p className="mx-auto max-w-sm text-muted-foreground">
            Nailed it! No notes!
          </p>
        ) : recommendations.length > 0 ? (
          <div className="mx-auto flex w-full max-w-md flex-col gap-3 text-left">
            <p className="text-center text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Sounds to practice
            </p>
            <ul className="flex flex-col gap-2">
              {recommendations.map((rec) => (
                <li
                  key={rec.id}
                  className="rounded-lg border border-border/70 bg-card/60 px-4 py-3 backdrop-blur-sm"
                >
                  <p className="font-medium text-foreground">{rec.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {rec.tip}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {onBack ? (
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      ) : null}
    </div>
  );
}
