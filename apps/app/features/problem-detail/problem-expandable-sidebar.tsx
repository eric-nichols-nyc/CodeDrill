"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { ProblemSideTabs } from "@/features/problem-detail/problem-side-tabs";

const EXPANDED_PX = 310;
const COLLAPSED_PX = 44;

export function ProblemExpandableSidebar({
  learningNotes,
}: {
  learningNotes?: unknown;
}) {
  const [open, setOpen] = useState(true);

  return (
    <aside
      className="flex h-full min-h-0 shrink-0 flex-col overflow-hidden border-border border-l bg-muted/20 transition-[width] duration-200 ease-out"
      style={{
        width: open ? `${EXPANDED_PX}px` : `${COLLAPSED_PX}px`,
      }}
    >
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
          <ProblemSideTabs learningNotes={learningNotes} />
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
