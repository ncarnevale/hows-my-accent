export type PronunciationIssue = {
  type: string;
  severity: "low" | "medium" | "high";
  examples: string[];
  practiceWords: string[];
  tip: string;
};

export type AnalyzeResponse = {
  transcript: string;
  score: number;
  issues: PronunciationIssue[];
};
