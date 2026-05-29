"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/design-system/components/ui/popover";
import { cn } from "@repo/design-system/lib/utils";
import { ChevronLeft, History, Plus, Sparkles } from "lucide-react";
import type { ProblemChatSessionSummary } from "@/features/problem-workspace/chat-panel/lib/chat-session-types";
import { ChatSessionHistory } from "./chat-session-history";

export type ChatHeaderProps = {
  title?: string;
  onNewChat?: () => void;
  onCollapse?: () => void;
  historyOpen?: boolean;
  onHistoryOpenChange?: (open: boolean) => void;
  historySessions?: ProblemChatSessionSummary[];
  historyLoading?: boolean;
  activeSessionId?: string | null;
  onSelectSession?: (sessionId: string) => void;
};

export function ChatHeader({
  title = "Leet",
  onNewChat,
  onCollapse,
  historyOpen = false,
  onHistoryOpenChange,
  historySessions = [],
  historyLoading = false,
  activeSessionId = null,
  onSelectSession,
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

        <Popover onOpenChange={onHistoryOpenChange} open={historyOpen}>
          <PopoverTrigger asChild>
            <Button
              aria-expanded={historyOpen}
              aria-label="Chat history"
              className={cn(
                "text-muted-foreground",
                historyOpen ? "bg-accent text-accent-foreground" : ""
              )}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <History className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-[min(100vw-2rem,18rem)] gap-0 border-border/80 bg-popover p-0 shadow-xl"
            side="bottom"
            sideOffset={4}
          >
            <ChatSessionHistory
              activeSessionId={activeSessionId}
              isLoading={historyLoading}
              onSelectSession={onSelectSession}
              sessions={historySessions}
            />
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
