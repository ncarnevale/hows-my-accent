"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const BAR_COUNT = 20;

type RecordingWaveformProps = {
  stream: MediaStream;
};

function getAudioContextConstructor():
  | (typeof window)["AudioContext"]
  | undefined {
  if (typeof window === "undefined") return undefined;
  return (
    window.AudioContext ??
    (
      window as Window &
        typeof globalThis & {
          webkitAudioContext?: typeof AudioContext;
        }
    ).webkitAudioContext
  );
}

export function RecordingWaveform({ stream }: RecordingWaveformProps) {
  const [barHeights, setBarHeights] = useState<number[]>(() =>
    Array.from({ length: BAR_COUNT }, () => 0.15)
  );
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const AudioContextClass = getAudioContextConstructor();
    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const analyser = context.createAnalyser();
    analyser.fftSize = 512;

    const source = context.createMediaStreamSource(stream);
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const sliceSize = Math.max(1, Math.floor(dataArray.length / BAR_COUNT));

    const tick = () => {
      analyser.getByteFrequencyData(dataArray);

      const heights = Array.from({ length: BAR_COUNT }, (_, barIndex) => {
        const start = barIndex * sliceSize;
        let sum = 0;
        for (let i = 0; i < sliceSize; i += 1) {
          sum += dataArray[start + i] ?? 0;
        }
        const average = sum / sliceSize;
        return Math.max(0.12, average / 255);
      });

      setBarHeights(heights);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      source.disconnect();
      void context.close();
    };
  }, [stream]);

  return (
    <div
      role="img"
      aria-label="Recording level"
      className="flex h-10 items-end justify-center gap-1"
    >
      {barHeights.map((height, index) => (
        <span
          key={index}
          data-waveform-bar
          aria-hidden
          className={cn(
            "w-1 min-h-[3px] rounded-full transition-[height] duration-75",
            index % 2 === 0 ? "bg-terracotta" : "bg-marigold"
          )}
          style={{ height: `${Math.round(height * 100)}%` }}
        />
      ))}
    </div>
  );
}
