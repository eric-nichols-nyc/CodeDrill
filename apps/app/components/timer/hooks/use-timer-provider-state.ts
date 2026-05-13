"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { TimerContextValue, TimerMode } from "../types";

export function useTimerProviderState(): TimerContextValue {
  const [mode, setMode] = useState<TimerMode>("stopwatch");
  const [seconds, setSeconds] = useState(0);
  const [countdownSeconds, setCountdownSeconds] = useState(60 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = window.setInterval(() => {
      setSeconds((current) => {
        if (mode === "stopwatch") {
          return current + 1;
        }

        if (current <= 1) {
          setIsRunning(false);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning, mode]);

  const start = useCallback(() => {
    setSeconds((current) => {
      if (mode === "timer" && current === 0) {
        return countdownSeconds;
      }
      return current;
    });
    setIsRunning(true);
  }, [mode, countdownSeconds]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setSeconds(mode === "timer" ? countdownSeconds : 0);
  }, [mode, countdownSeconds]);

  const handleModeChange = useCallback(
    (nextMode: TimerMode) => {
      setMode(nextMode);
      setIsRunning(false);
      setSeconds(nextMode === "timer" ? countdownSeconds : 0);
    },
    [countdownSeconds]
  );

  return useMemo(
    () => ({
      mode,
      setMode: handleModeChange,
      seconds,
      countdownSeconds,
      isRunning,
      setCountdownSeconds,
      start,
      pause,
      reset,
    }),
    [
      mode,
      seconds,
      countdownSeconds,
      isRunning,
      handleModeChange,
      start,
      pause,
      reset,
    ]
  );
}
