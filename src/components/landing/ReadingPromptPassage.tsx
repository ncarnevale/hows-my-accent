import { MVP_PASSAGE_DISPLAY } from "@/lib/passages";

const PASSAGE_SOUNDS = ["rr", "ñ", "ll", "j", "g", "ó"];

export function ReadingPromptPassage() {
  return (
    <article className="relative overflow-hidden rounded-2xl bg-card/85 p-6 shadow-sm ring-1 ring-foreground/8 backdrop-blur-md sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-marigold/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-12 size-44 rounded-full bg-jade/20 blur-3xl"
      />

      <div className="relative flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Sample passage
            </span>
            <span className="text-sm text-muted-foreground/90">
              Simple pronunciation test · LATAM Spanish
            </span>
          </div>
          <ul className="hidden flex-wrap justify-end gap-1 sm:flex">
            {PASSAGE_SOUNDS.map((sound) => (
              <li
                key={sound}
                className="rounded-full border border-border/70 bg-background/60 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
              >
                {sound}
              </li>
            ))}
          </ul>
        </div>

        <p className="font-serif text-[19px] leading-[1.55] whitespace-pre-line text-foreground/90 sm:text-xl sm:leading-[1.6]">
          {MVP_PASSAGE_DISPLAY}
        </p>
      </div>
    </article>
  );
}
