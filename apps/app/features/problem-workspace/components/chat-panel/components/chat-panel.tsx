"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/design-system/components/ui/tabs";
import { cn } from "@repo/design-system/lib/utils";
import { Sparkles, StickyNote } from "lucide-react";
import { ChatShell } from "@/features/problem-workspace/components/chat-panel/components/chat-shell";
import { ProblemNotes } from "@/features/problem-workspace/components/chat-panel/components/problem-notes";
import { ShellPanel } from "@/features/problem-workspace/components/shell/shell-panel";

const panelClass =
  "min-h-0 flex-1 overflow-y-auto pr-1 pt-1 outline-none ring-offset-background focus-visible:outline-none";

export function ChatPanel() {
  return (
    <ShellPanel>
      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <Tabs
          className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden p-2 pt-2"
          defaultValue="chat"
        >
          <TabsList className="h-auto w-full min-w-0 shrink-0 flex-wrap justify-start gap-1 sm:flex-nowrap">
            <TabsTrigger className="shrink-0 gap-1.5" value="chat">
              <Sparkles className="size-3.5 text-violet-400" />
              Chat
            </TabsTrigger>
            <TabsTrigger className="shrink-0 gap-1.5" value="notes">
              <StickyNote className="size-3.5 text-amber-400" />
              Notes
            </TabsTrigger>
          </TabsList>
          <TabsContent
            className={cn(panelClass, "flex min-h-0 flex-col")}
            value="chat"
          >
            <ChatShell />
          </TabsContent>
          <TabsContent className={panelClass} value="notes">
            <ProblemNotes />
          </TabsContent>
        </Tabs>
      </div>
    </ShellPanel>
  );
}
