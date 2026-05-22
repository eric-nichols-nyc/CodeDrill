"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { ChevronLeft, ChevronRight, GripVertical } from "lucide-react";
import { type PointerEvent as ReactPointerEvent, useCallback, useEffect, useRef, useState } from "react";
import { ProblemSideTabs } from "@/features/problem-detail/components/problem-side-tabs";
import type { GetProblemChatMessagesResponse } from "@/features/problem-detail/chatbot/lib/problem-chat-types";

const DEFAULT_WIDTH_PX = 310;
const MIN_WIDTH_PX = 240;
const MAX_WIDTH_PX = 640;
const MAX_VIEWPORT_FRACTION = 0.6;
const COLLAPSED_PX = 44;

const clampWidth = (raw: number) => {
  const ceiling = Math.min(
    MAX_WIDTH_PX,
    typeof window === "undefined"
      ? MAX_WIDTH_PX
      : window.innerWidth * MAX_VIEWPORT_FRACTION
  );
  return Math.min(ceiling, Math.max(MIN_WIDTH_PX, raw));
};

export function ProblemExpandableSidebar({
  learningNotes,
  problemId,
  initialChatData,
}: {
  learningNotes?: unknown;
  problemId?: string;
  initialChatData?: GetProblemChatMessagesResponse;
}) {
  const [open, setOpen] = useState(true);
  const [widthPx, setWidthPx] = useState(DEFAULT_WIDTH_PX);
  const [isDragging, setIsDragging] = useState(false);
  const asideRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isDragging) {
      return;
    }

    const handleMove = (event: PointerEvent) => {
      const aside = asideRef.current;
      if (!aside) {
        return;
      }
      const rect = aside.getBoundingClientRect();
      setWidthPx(clampWidth(rect.right - event.clientX));
    };

    const stopDragging = () => setIsDragging(false);

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", stopDragging);
    window.addEventListener("pointercancel", stopDragging);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", stopDragging);
      window.removeEventListener("pointercancel", stopDragging);
    };
  }, [isDragging]);

  const handleResizePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setIsDragging(true);
    },
    []
  );

  return (
    <aside
      className={`relative flex h-full min-h-0 shrink-0 flex-col overflow-hidden border-border border-l bg-muted/20 ${
        isDragging ? "" : "transition-[width] duration-200 ease-out"
      }`}
      ref={asideRef}
      style={{
        width: open ? `${widthPx}px` : `${COLLAPSED_PX}px`,
      }}
    >
      {open ? (
        <button
          aria-label="Drag to resize sidebar"
          className="group absolute top-0 left-0 z-20 flex h-full w-3 cursor-col-resize touch-none select-none items-center justify-center border-0 bg-transparent p-0"
          onPointerDown={handleResizePointerDown}
          type="button"
        >
          <span className="pointer-events-none absolute inset-y-0 left-0 w-px bg-transparent transition-colors group-hover:bg-primary/50 group-active:bg-primary" />
          <GripVertical className="pointer-events-none relative z-10 h-4 w-4 shrink-0 text-muted-foreground/60 transition-colors group-hover:text-primary group-active:text-primary" />
        </button>
      ) : null}

      {open ? (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex h-9 shrink-0 items-center justify-end border-border border-b px-1">
            <Button
              aria-label="Collapse sidebar"
              className="size-8 shrink-0"
              onClick={() => setOpen(false)}
              size="icon"
              type="button"
              variant="ghost"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
          <ProblemSideTabs
            initialChatData={initialChatData}
            learningNotes={learningNotes}
            problemId={problemId}
          />
        </div>
      ) : (
        <button
          aria-label="Expand chat and notes sidebar"
          className="flex h-full min-h-0 w-full flex-col items-center gap-2 border-border border-b bg-muted/30 py-3 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          onClick={() => setOpen(true)}
          type="button"
        >
          <ChevronLeft className="size-5 shrink-0" />
          <span className="rotate-180 font-medium text-[10px] leading-none tracking-wide [writing-mode:vertical-rl]">
            Chat
          </span>
        </button>
      )}
    </aside>
  );
}
