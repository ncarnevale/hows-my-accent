import { RecordButtonPlaceholder } from "@/components/landing/RecordButtonPlaceholder";
import { MVP_PASSAGE_DISPLAY } from "@/data/passages";

const PASSAGE_SOUNDS = ["rr", "ñ", "ll", "j", "g", "ó"];

export function ReadingPrompt() {
  return (
    <div className="flex w-full flex-col gap-10">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-sm">
          <span className="size-1.5 rounded-full bg-terracotta" />
          Step 1 · Read aloud
        </span>
        <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Take a breath, then read at your{" "}
          <span className="font-serif font-medium text-terracotta">
            natural pace
          </span>
          .
        </h2>
        <p className="max-w-md text-balance text-sm text-muted-foreground">
          Don&apos;t aim for perfection — we&apos;ll listen for the tricky
          sounds and give you a friendly nudge.
        </p>
      </div>

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
                Your passage
              </span>
              <span className="text-sm text-muted-foreground/90">
                A short story · LATAM Spanish
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

      <RecordButtonPlaceholder />
    </div>
  );
}
