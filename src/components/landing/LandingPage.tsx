"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import { LandingHero } from "@/components/landing/LandingHero";
import { ReadingPrompt } from "@/components/landing/ReadingPrompt";
import { Button } from "@/components/ui/button";

type Step = "landing" | "prompt";

export function LandingPage() {
  const [step, setStep] = useState<Step>("landing");

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden ambient-backdrop">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 ambient-grain"
      />

      <div className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 py-6 sm:px-8 sm:py-10">
        <header className="mb-10 flex items-center justify-between sm:mb-14">
          <BrandMark />
          {step === "prompt" ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep("landing")}
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>
          ) : (
            <span
              className="hidden items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm sm:inline-flex"
              aria-hidden
            >
              <span className="size-1.5 rounded-full bg-jade animate-dot-pulse" />
              Español · LATAM
            </span>
          )}
        </header>

        <main className="flex flex-1 flex-col items-center justify-center">
          {step === "landing" ? (
            <LandingHero onStart={() => setStep("prompt")} />
          ) : (
            <ReadingPrompt />
          )}
        </main>

        <footer className="mt-12 flex items-center justify-center gap-2 text-xs text-muted-foreground/80 sm:mt-16">
          <span>No sign-up</span>
          <span aria-hidden className="text-muted-foreground/40">
            ·
          </span>
          <span>Audio is never stored</span>
          <span aria-hidden className="text-muted-foreground/40">
            ·
          </span>
          <span>Hecho con cariño</span>
        </footer>
      </div>
    </div>
  );
}

function BrandMark() {
  return (
    <div className="flex items-center gap-2.5">
      <span
        aria-hidden
        className="relative grid size-8 place-items-center rounded-lg bg-linear-to-br from-terracotta to-marigold text-primary-foreground shadow-sm ring-1 ring-foreground/5"
      >
        <span className="font-serif text-[18px] leading-none">~</span>
      </span>
      <span className="text-sm font-bold font-serif tracking-tight text-foreground">
        How's My Accent?
      </span>
    </div>
  );
}
