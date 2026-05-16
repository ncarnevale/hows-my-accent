import { RecordButtonPlaceholder } from "@/components/landing/RecordButtonPlaceholder";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MVP_PASSAGE_DISPLAY } from "@/data/passages";

export function ReadingPrompt() {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-2 text-center">
        <p className="text-sm text-muted-foreground">
          Tap Record, then read the passage aloud at a natural pace.
        </p>
        <p className="text-sm text-muted-foreground">
          Don&apos;t worry about perfection — just speak clearly.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your passage</CardTitle>
          <CardDescription>Read this aloud in Spanish</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed whitespace-pre-line">
            {MVP_PASSAGE_DISPLAY}
          </p>
        </CardContent>
      </Card>

      <RecordButtonPlaceholder />
    </div>
  );
}
