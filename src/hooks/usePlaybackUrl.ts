"use client";

import { useEffect, useMemo } from "react";

export function usePlaybackUrl(blob: Blob | null) {
  const playbackUrl = useMemo(
    () => (blob ? URL.createObjectURL(blob) : null),
    [blob],
  );

  useEffect(
    () => () => {
      if (playbackUrl) URL.revokeObjectURL(playbackUrl);
    },
    [playbackUrl],
  );

  return playbackUrl;
}
