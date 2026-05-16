"use client";

import { ReadingPromptHeader } from "@/components/landing/ReadingPromptHeader";
import { ReadingPromptPassage } from "@/components/landing/ReadingPromptPassage";
import { RecordControl } from "@/components/recorder/RecordControl";

export type ReadingPromptProps = {
  onSubmit?: (blob: Blob) => void;
};

export function ReadingPrompt({ onSubmit = () => {} }: ReadingPromptProps) {
  return (
    <div className="flex w-full flex-col gap-10">
      <ReadingPromptHeader />
      <ReadingPromptPassage />
      <RecordControl onSubmit={onSubmit} />
    </div>
  );
}
