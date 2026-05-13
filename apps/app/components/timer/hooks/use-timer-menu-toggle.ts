"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTimer } from "../timer-context";

export type TimerMenuChromeState = {
  open: boolean;
  setOpen: (value: boolean | ((current: boolean) => boolean)) => void;
  showBar: boolean;
  sessionActive: boolean;
  collapseBar: () => void;
  togglePopupOpen: () => void;
};

/**
 * Local UI state for the header timer: popup open, collapsed vs inline bar,
 * and syncing expand/collapse with session + run transitions.
 */
export function useTimerMenuToggle(): TimerMenuChromeState {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { isRunning, seconds } = useTimer();
  const wasRunningRef = useRef(isRunning);

  const sessionActive = isRunning || seconds > 0;
  const showBar = sessionActive && !collapsed;

  useEffect(() => {
    if (!sessionActive) {
      setCollapsed(false);
    }
  }, [sessionActive]);

  useEffect(() => {
    if (isRunning && !wasRunningRef.current) {
      setCollapsed(false);
    }
    wasRunningRef.current = isRunning;
  }, [isRunning]);

  const collapseBar = useCallback(() => {
    setCollapsed(true);
    setOpen(false);
  }, []);

  const togglePopupOpen = useCallback(() => {
    setOpen((v) => !v);
  }, []);

  return {
    open,
    setOpen,
    showBar,
    sessionActive,
    collapseBar,
    togglePopupOpen,
  };
}
