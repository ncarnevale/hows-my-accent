const DOT_COLOR_CLASSES = {
  terracotta: "bg-terracotta",
  marigold: "bg-marigold",
  jade: "bg-jade",
  plum: "bg-plum",
} as const;

type StepIndicatorColor = keyof typeof DOT_COLOR_CLASSES;

type StepIndicatorProps = {
  color: StepIndicatorColor;
  stepNumber: number;
  text: string;
};

export function StepIndicator({ color, stepNumber, text }: StepIndicatorProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-sm">
      <span className={`size-1.5 rounded-full ${DOT_COLOR_CLASSES[color]}`} />
      Step {stepNumber} · {text}
    </span>
  );
}
