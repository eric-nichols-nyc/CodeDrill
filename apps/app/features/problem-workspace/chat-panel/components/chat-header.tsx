"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { cn } from "@repo/design-system/lib/utils";
import { ChevronLeft, History, Plus, Sparkles } from "lucide-react";

export type ChatHeaderProps = {
  title?: string;
  onNewChat?: () => void;
  onOpenHistory?: () => void;
  onCollapse?: () => void;
  isHistoryOpen?: boolean;
};

export function ChatHeader({
  title = "Leet",
  onNewChat,
  onOpenHistory,
  onCollapse,
  isHistoryOpen = false,
}: ChatHeaderProps) {
  return (
    <header className="shrink-0 border-border border-b bg-background">
      <div className="flex items-center justify-between gap-2 px-2 py-1.5">
        <div className="flex min-w-0 items-center gap-1.5">
          <Sparkles aria-hidden="true" className="size-3.5 shrink-0 text-primary" />
          <span className="truncate font-medium text-foreground text-sm">{title}</span>
        </div>

        {onCollapse ? (
          <Button
            aria-label="Collapse chat panel"
            className="text-muted-foreground"
            onClick={onCollapse}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <ChevronLeft className="size-4" />
          </Button>
        ) : null}
      </div>

      <div className="flex items-center justify-end gap-0.5 border-border border-t px-2 py-1">
        <Button
          aria-label="New chat"
          className="text-muted-foreground"
          disabled={!onNewChat}
          onClick={onNewChat}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <Plus className="size-4" />
        </Button>
        <Button
          aria-expanded={isHistoryOpen}
          aria-label="Chat history"
          className={cn(
            "text-muted-foreground",
            isHistoryOpen ? "bg-accent text-accent-foreground" : undefined
          )}
          disabled={!onOpenHistory}
          onClick={onOpenHistory}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <History className="size-4" />
        </Button>
      </div>
    </header>
  );
}
