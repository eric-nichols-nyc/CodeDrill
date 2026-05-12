"use client";

import { ChevronRight, MessageCircle } from "lucide-react";
import { useState } from "react";

const COLLAPSED_PX = 36;
const EXPANDED_MIN_PX = 310;

export function ExpandableChat() {
  const [open, setOpen] = useState(false);

  return (
    <aside
      className="flex h-full shrink-0 flex-col border-border border-l bg-muted/20 transition-[width] duration-200 ease-out"
      style={{
        width: open
          ? `max(${EXPANDED_MIN_PX}px, min(100vw - 2rem, 400px))`
          : `${COLLAPSED_PX}px`,
      }}
    >
      {open ? (
        <>
          <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-border border-b px-2">
            <span className="truncate font-medium text-sm">Chat</span>
            <button
              aria-expanded
              aria-label="Collapse chat"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={() => setOpen(false)}
              type="button"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-auto p-3">
            <p className="text-muted-foreground text-sm">
              Chat messages will appear here.
            </p>
          </div>
        </>
      ) : (
        <button
          aria-expanded={false}
          aria-label="Expand chat"
          className="flex min-h-0 flex-1 flex-col items-center gap-2 pt-3 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          onClick={() => setOpen(true)}
          type="button"
        >
          <MessageCircle className="h-5 w-5 shrink-0" />
        </button>
      )}
    </aside>
  );
}
