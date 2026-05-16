"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import { LandingHero } from "@/components/landing/LandingHero";
import { ReadingPrompt } from "@/components/landing/ReadingPrompt";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Step = "landing" | "prompt";

export function LandingPage() {
  const [step, setStep] = useState<Step>("landing");

  return (
    <div
      className={cn(
        "flex min-h-full flex-1 flex-col",
        "bg-gradient-to-b from-background via-muted/30 to-background"
      )}
    >
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-8 flex items-center justify-between">
          <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            How&apos;s My Accent
          </p>
          {step === "prompt" ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep("landing")}
              className="gap-1.5"
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>
          ) : (
            <span className="size-8" aria-hidden />
          )}
        </header>

        <main className="flex flex-1 flex-col items-center justify-center">
          {step === "landing" ? (
            <LandingHero onStart={() => setStep("prompt")} />
          ) : (
            <ReadingPrompt />
          )}
        </main>
      </div>
    </div>
  );
}
