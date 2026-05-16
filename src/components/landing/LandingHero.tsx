import { Button } from "@/components/ui/button";

type LandingHeroProps = {
  onStart: () => void;
};

export function LandingHero({ onStart }: LandingHeroProps) {
  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          How&apos;s your Spanish accent?
        </h1>
        <p className="max-w-md text-lg text-muted-foreground text-balance">
          Practice Latin American Spanish pronunciation with AI-assisted
          feedback.
        </p>
      </div>
      <Button size="lg" className="w-full sm:w-auto" onClick={onStart}>
        Test Your Accent
      </Button>
    </div>
  );
}
