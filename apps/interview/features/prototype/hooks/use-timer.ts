"use client";

import { useEffect, useState } from "react";

function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

export function useTimer(running: boolean) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!running) {
      return;
    }

    const id = window.setInterval(() => {
      setSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(id);
  }, [running]);

  return formatTimer(seconds);
}
