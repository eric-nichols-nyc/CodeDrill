"use client";

import { createContext, type ReactNode, useContext } from "react";
import { useTimerProviderState } from "./hooks/use-timer-provider-state";
import type { TimerContextValue } from "./types";

const TimerContext = createContext<TimerContextValue | null>(null);

export function useTimer() {
  const context = useContext(TimerContext);

  if (!context) {
    throw new Error("useTimer must be used inside TimerProvider");
  }

  return context;
}

export function TimerProvider({ children }: { children: ReactNode }) {
  const value = useTimerProviderState();

  return (
    <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
  );
}
