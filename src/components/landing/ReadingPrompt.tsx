import { ReadingPromptHeader } from "@/components/landing/ReadingPromptHeader";
import { ReadingPromptPassage } from "@/components/landing/ReadingPromptPassage";
import { RecordButtonPlaceholder } from "@/components/landing/RecordButtonPlaceholder";

export function ReadingPrompt() {
  return (
    <div className="flex w-full flex-col gap-10">
      <ReadingPromptHeader />
      <ReadingPromptPassage />
      <RecordButtonPlaceholder />
    </div>
  );
}
