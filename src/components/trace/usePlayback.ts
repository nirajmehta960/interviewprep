"use client";

import { useCallback, useEffect, useState } from "react";

export const SPEEDS = [0.5, 1, 1.5, 2] as const;
export type Speed = (typeof SPEEDS)[number];

const BASE_INTERVAL_MS = 900;

/**
 * Shared timeline playback: cursor, play/pause, speed, and keyboard control.
 * Used by both the authored and the auto-generated workbenches so their
 * behaviour cannot drift apart.
 */
export function usePlayback(total: number) {
  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<Speed>(1);

  const atEnd = cursor >= total - 1;

  // Advance while playing, stopping on the last step.
  useEffect(() => {
    if (!playing || total === 0) return;

    const id = window.setInterval(() => {
      setCursor((current) => {
        if (current >= total - 1) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, BASE_INTERVAL_MS / speed);

    return () => window.clearInterval(id);
  }, [playing, speed, total]);

  // Clamp when the trace is replaced by a shorter one.
  useEffect(() => {
    setCursor((current) => (current > total - 1 ? Math.max(0, total - 1) : current));
  }, [total]);

  const goTo = useCallback(
    (index: number) => setCursor(Math.max(0, Math.min(total - 1, index))),
    [total],
  );

  const reset = useCallback(() => {
    setPlaying(false);
    setCursor(0);
  }, []);

  const togglePlay = useCallback(() => {
    if (atEnd) {
      setCursor(0);
      setPlaying(true);
      return;
    }
    setPlaying((value) => !value);
  }, [atEnd]);

  const stepBy = useCallback(
    (delta: number) => {
      setPlaying(false);
      setCursor((current) => Math.max(0, Math.min(total - 1, current + delta)));
    },
    [total],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      // Never hijack keys while a field is being typed into.
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;

      if (event.code === "Space") {
        event.preventDefault();
        togglePlay();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        stepBy(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        stepBy(-1);
      } else if (event.key.toLowerCase() === "r") {
        reset();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [togglePlay, stepBy, reset]);

  return { cursor, playing, speed, atEnd, setSpeed, setPlaying, goTo, reset, togglePlay, stepBy };
}
