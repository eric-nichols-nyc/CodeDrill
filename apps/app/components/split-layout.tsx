"use client";

import { GripHorizontal, GripVertical } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export type SplitOrientation = "vertical" | "horizontal";

type SplitLayoutProps = {
  orientation?: SplitOrientation;
  /**
   * Vertical: width of the left pane. Horizontal: height of the top pane (`left` prop).
   * Percent of the container (0–100).
   */
  defaultLeftPercent?: number;
  /** Vertical: minimum left width. Horizontal: minimum top height. */
  minLeftPx?: number;
  /** Vertical: minimum right width. Horizontal: minimum bottom height. */
  minRightPx?: number;
  className?: string;
  /** Vertical: left pane. Horizontal: top pane. */
  left: React.ReactNode;
  /** Vertical: right pane. Horizontal: bottom pane. */
  right: React.ReactNode;
};

export function SplitLayout({
  orientation = "vertical",
  defaultLeftPercent = 44,
  minLeftPx = 200,
  minRightPx = 240,
  className = "",
  left,
  right,
}: SplitLayoutProps) {
  const [primaryPercent, setPrimaryPercent] = useState(defaultLeftPercent);
  const dragRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const clampPercent = useCallback(
    (raw: number) => {
      const el = containerRef.current;
      if (!el) {
        return raw;
      }
      const rect = el.getBoundingClientRect();
      const size = orientation === "vertical" ? rect.width : rect.height;
      if (size <= 0) {
        return raw;
      }
      const minFirst = (minLeftPx / size) * 100;
      const minSecond = (minRightPx / size) * 100;
      return Math.min(100 - minSecond, Math.max(minFirst, raw));
    },
    [minLeftPx, minRightPx, orientation]
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragRef.current) {
        return;
      }
      const el = containerRef.current;
      if (!el) {
        return;
      }
      const rect = el.getBoundingClientRect();
      const ratio =
        orientation === "vertical"
          ? (e.clientX - rect.left) / rect.width
          : (e.clientY - rect.top) / rect.height;
      setPrimaryPercent(clampPercent(ratio * 100));
    };

    const onUp = () => {
      dragRef.current = false;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [clampPercent, orientation]);

  const isVertical = orientation === "vertical";
  const resizeLabel = isVertical
    ? "Drag to resize left and right panels"
    : "Drag to resize top and bottom panels";

  return (
    <div
      className={`flex min-h-0 w-full ${isVertical ? "h-full flex-row" : "h-full min-h-0 flex-col"} ${className}`}
      ref={containerRef}
    >
      <section
        className={
          isVertical
            ? "h-full min-h-0 min-w-0 shrink-0 overflow-hidden"
            : "flex min-h-0 w-full min-w-0 shrink-0 flex-col overflow-hidden"
        }
        style={
          isVertical
            ? { width: `${primaryPercent}%` }
            : { height: `${primaryPercent}%` }
        }
      >
        {left}
      </section>
      <button
        aria-label={resizeLabel}
        className={
          isVertical
            ? "group relative z-10 flex w-5 shrink-0 cursor-col-resize touch-none select-none items-center justify-center border-0 bg-transparent p-0"
            : "group relative z-10 flex h-5 w-full shrink-0 cursor-row-resize touch-none select-none items-center justify-center border-0 bg-transparent p-0"
        }
        onPointerDown={(e) => {
          e.preventDefault();
          dragRef.current = true;
        }}
        type="button"
      >
        <span
          className={
            isVertical
              ? "-translate-x-1/2 pointer-events-none absolute inset-y-1 left-1/2 w-px bg-border/80 transition-colors group-hover:bg-primary/50 group-active:bg-primary"
              : "-translate-y-1/2 pointer-events-none absolute inset-x-1 top-1/2 h-px bg-border/80 transition-colors group-hover:bg-primary/50 group-active:bg-primary"
          }
        />
        {isVertical ? (
          <GripVertical className="pointer-events-none relative z-10 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary group-active:text-primary" />
        ) : (
          <GripHorizontal className="pointer-events-none relative z-10 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary group-active:text-primary" />
        )}
      </button>
      <section
        className={
          isVertical
            ? "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
            : "flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden"
        }
      >
        {right}
      </section>
    </div>
  );
}
