import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

type LandingHeroProps = {
  onStart: () => void;
};

const SOUND_HIGHLIGHTS = [
  { label: "rolled rr", tone: "terracotta" },
  { label: "ñ", tone: "marigold" },
  { label: "ll · y", tone: "jade" },
  { label: "soft g · j", tone: "plum" },
  { label: "b · v", tone: "terracotta" },
] as const;

const TONE_CLASSES: Record<(typeof SOUND_HIGHLIGHTS)[number]["tone"], string> =
  {
    terracotta: "border-terracotta/25 bg-terracotta/8 text-terracotta",
    marigold: "border-marigold/30 bg-marigold/12 text-foreground/80",
    jade: "border-jade/25 bg-jade/8 text-jade",
    plum: "border-plum/25 bg-plum/8 text-plum",
  };

export function LandingHero({ onStart }: LandingHeroProps) {
  return (
    <div className="flex w-full flex-col items-center gap-9 text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
        <Sparkles className="size-3.5 text-marigold" strokeWidth={2.25} />
        AI-assisted pronunciation coach
      </span>

      <div className="flex flex-col gap-5">
        <h1 className="text-balance text-4xl font-semibold font-serif tracking-tight text-foreground sm:text-5xl md:text-[3.5rem] md:leading-[1.05]">
          How&apos;s your{" "}
          <span className="font-medium bg-linear-to-br from-terracotta via-[oklch(0.65_0.18_45)] to-marigold bg-clip-text text-transparent">
            Spanish accent{" "}
          </span>
          ?
        </h1>
        <p className="mx-auto max-w-md text-balance text-base text-muted-foreground sm:text-lg">
          Read a short passage out loud and get warm, honest feedback on your
          Latin American Spanish — sound by sound, word by word.
        </p>
      </div>

      <Button
        size="lg"
        onClick={onStart}
        className="group/cta h-12 rounded-full px-6 text-base font-medium shadow-md shadow-terracotta/20 hover:shadow-lg hover:shadow-terracotta/25"
      >
        Test your accent
        <ArrowRight
          className="size-4 transition-transform group-hover/cta:translate-x-0.5"
          strokeWidth={2.25}
        />
      </Button>

      <div className="flex flex-col items-center gap-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground/80">
          You&apos;ll practice
        </p>
        <ul className="flex flex-wrap justify-center gap-1.5">
          {SOUND_HIGHLIGHTS.map(({ label, tone }) => (
            <li
              key={label}
              className={`rounded-full border px-2.5 py-1 text-xs font-medium ${TONE_CLASSES[tone]}`}
            >
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
