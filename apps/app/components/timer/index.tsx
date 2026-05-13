"use client";

import { cn } from "@repo/design-system/lib/utils";
import {
  ChevronLeft,
  Clock3,
  Pause,
  Play,
  RotateCcw,
  Timer,
} from "lucide-react";
import type { ReactNode } from "react";
import { formatTimeHMS } from "./format-time-hms";
import { useTimerMenuToggle } from "./hooks/use-timer-menu-toggle";
import { useTimer } from "./timer-context";

export type { TimerMenuChromeState } from "./hooks/use-timer-menu-toggle";
// biome-ignore lint/performance/noBarrelFile: public entry re-exports timer context API
export { TimerProvider, useTimer } from "./timer-context";
export type { TimerContextValue, TimerMode } from "./types";

export type TimerMenuButtonProps = {
  /** Classes for the outer wrapper (e.g. layout). */
  className?: string;
  /** Classes merged into the icon trigger button (size, nav colors). */
  triggerClassName?: string;
  iconClassName?: string;
};

export function TimerMenuButton({
  className,
  triggerClassName,
  iconClassName = "h-7 w-7",
}: TimerMenuButtonProps = {}) {
  const { open, setOpen, showBar, collapseBar, togglePopupOpen } =
    useTimerMenuToggle();
  const { mode, isRunning } = useTimer();

  return (
    <div
      className={cn("relative shrink-0", showBar ? "w-auto" : false, className)}
    >
      {showBar ? (
        <ActiveTimerBar onCollapse={collapseBar} />
      ) : (
        <>
          <button
            aria-label="Timer"
            className={cn(
              "flex h-14 w-16 items-center justify-center rounded-xl bg-neutral-800 text-blue-400",
              triggerClassName,
              isRunning
                ? "text-[var(--teal-accent)] hover:text-[var(--teal-accent)]"
                : false
            )}
            onClick={togglePopupOpen}
            type="button"
          >
            {mode === "stopwatch" ? (
              <Timer className={cn(iconClassName)} />
            ) : (
              <Clock3 className={cn(iconClassName, "text-orange-400")} />
            )}
          </button>

          {open ? <TimerPopup onClose={() => setOpen(false)} /> : null}
        </>
      )}
    </div>
  );
}

function TimerPopup({ onClose }: { onClose: () => void }) {
  const { mode, setMode, start } = useTimer();

  return (
    <div
      className={cn(
        "absolute top-full right-0 z-50 mt-1 flex w-[226px] flex-col gap-2 overflow-hidden rounded-2xl border border-neutral-600 bg-neutral-800 p-3 shadow-xl",
        mode === "timer" ? "h-[174px]" : "h-auto"
      )}
    >
      <div className="grid shrink-0 grid-cols-2 gap-2">
        <ModeCard
          active={mode === "stopwatch"}
          icon={<Timer className="h-5 w-5 text-blue-400" />}
          label="Stopwatch"
          onClick={() => setMode("stopwatch")}
        />

        <ModeCard
          active={mode === "timer"}
          icon={<Clock3 className="h-5 w-5 text-orange-400" />}
          label="Timer"
          onClick={() => setMode("timer")}
        />
      </div>

      {mode === "timer" ? (
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <CountdownPanel compact />
        </div>
      ) : null}

      <button
        className="flex h-9 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-white font-semibold text-neutral-950 text-xs"
        onClick={() => {
          start();
          onClose();
        }}
        type="button"
      >
        <Play className="h-4 w-4 fill-current" />
        {mode === "timer" ? "Start Timer" : "Start Stopwatch"}
      </button>
    </div>
  );
}

function ModeCard({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={[
        "flex h-[58px] flex-col items-center justify-center gap-1 rounded-xl border font-semibold text-xs leading-tight transition",
        active
          ? "border-neutral-300 bg-neutral-700 text-white"
          : "border-neutral-600 bg-neutral-800 text-neutral-400",
      ].join(" ")}
      onClick={onClick}
      type="button"
    >
      {icon}
      {label}
    </button>
  );
}

function CountdownPanel({ compact = false }: { compact?: boolean }) {
  const { countdownSeconds, setCountdownSeconds } = useTimer();

  const hours = Math.floor(countdownSeconds / 3600);
  const minutes = Math.floor((countdownSeconds % 3600) / 60);

  function updateTime(nextHours: number, nextMinutes: number) {
    setCountdownSeconds(nextHours * 3600 + nextMinutes * 60);
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center text-white",
        compact ? "gap-1.5" : "gap-3"
      )}
    >
      <input
        className={cn(
          "rounded-xl border border-neutral-600 bg-neutral-700 text-center font-bold",
          compact ? "h-9 w-11 text-base" : "h-16 w-20 text-3xl"
        )}
        onChange={(e) => updateTime(Number(e.target.value), minutes)}
        value={String(hours).padStart(2, "0")}
      />
      <span
        className={cn(
          compact ? "text-neutral-300 text-xs" : "text-neutral-300 text-xl"
        )}
      >
        hr
      </span>

      <input
        className={cn(
          "rounded-xl border border-neutral-600 bg-neutral-700 text-center font-bold",
          compact ? "h-9 w-11 text-base" : "h-16 w-20 text-3xl"
        )}
        onChange={(e) => updateTime(hours, Number(e.target.value))}
        value={String(minutes).padStart(2, "0")}
      />
      <span
        className={cn(
          compact ? "text-neutral-300 text-xs" : "text-neutral-300 text-xl"
        )}
      >
        min
      </span>
    </div>
  );
}

function ActiveTimerBar({
  onCollapse,
  variant = "nav",
}: {
  onCollapse?: () => void;
  variant?: "nav" | "panel";
}) {
  const { mode, seconds, isRunning, pause, start, reset } = useTimer();

  const shell =
    variant === "nav"
      ? "border-neutral-700 bg-neutral-950 text-sky-400 shadow-lg"
      : "border-border bg-muted/40 text-sky-600 shadow-sm dark:text-sky-400";

  const iconBtn =
    variant === "nav"
      ? "text-neutral-400 transition-colors hover:text-neutral-300"
      : "text-muted-foreground transition-colors hover:text-foreground";

  return (
    <div
      className={cn(
        "flex h-8 max-w-full shrink-0 items-center gap-2 rounded-lg border px-2",
        shell
      )}
    >
      {onCollapse ? (
        <button
          aria-label="Show timer icon"
          className={cn("flex shrink-0", iconBtn)}
          onClick={onCollapse}
          type="button"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      ) : null}

      <button
        className={cn("shrink-0", iconBtn)}
        onClick={() => {
          if (isRunning) {
            pause();
          } else {
            start();
          }
        }}
        type="button"
      >
        {isRunning ? (
          <Pause className="h-4 w-4 fill-current" />
        ) : (
          <Play className="h-4 w-4 fill-current" />
        )}
      </button>

      <span className="min-w-[4.75rem] shrink-0 font-mono text-sm tabular-nums">
        {formatTimeHMS(seconds)}
      </span>

      <button className={cn("shrink-0", iconBtn)} onClick={reset} type="button">
        <RotateCcw
          className={cn(
            "h-4 w-4",
            mode === "timer" ? "text-orange-500 dark:text-orange-400" : ""
          )}
        />
      </button>
    </div>
  );
}

/** Readout + controls for the output panel; uses the same timer context as the header. */
export function TimerPanelBar() {
  return <ActiveTimerBar variant="panel" />;
}
