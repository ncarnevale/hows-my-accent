"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function usePlayback(playbackUrl: string | null) {
  const [isPlaying, setIsPlaying] = useState(false);
  const detachListenersRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setIsPlaying(false);
  }, [playbackUrl]);

  useEffect(() => () => detachListenersRef.current?.(), []);

  const attachAudioRef = useCallback((node: HTMLAudioElement | null) => {
    detachListenersRef.current?.();
    detachListenersRef.current = null;

    if (!node) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    node.addEventListener("play", onPlay);
    node.addEventListener("pause", onPause);
    node.addEventListener("ended", onEnded);

    detachListenersRef.current = () => {
      node.removeEventListener("play", onPlay);
      node.removeEventListener("pause", onPause);
      node.removeEventListener("ended", onEnded);
    };
  }, []);

  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const audioRef = useCallback(
    (node: HTMLAudioElement | null) => {
      audioElementRef.current = node;
      attachAudioRef(node);
    },
    [attachAudioRef],
  );

  const pausePlayback = useCallback(() => {
    const audio = audioElementRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
  }, []);

  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      pausePlayback();
      return;
    }
    void Promise.resolve(audioElementRef.current?.play())
      .then(() => setIsPlaying(true))
      .catch(() => {});
  }, [isPlaying, pausePlayback]);

  return { audioRef, isPlaying, togglePlayback };
}
