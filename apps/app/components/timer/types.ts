export type TimerMode = "stopwatch" | "timer";

export type TimerContextValue = {
  mode: TimerMode;
  setMode: (mode: TimerMode) => void;
  seconds: number;
  countdownSeconds: number;
  isRunning: boolean;
  setCountdownSeconds: (seconds: number) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
};
