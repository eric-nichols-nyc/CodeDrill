"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/design-system/components/ui/tabs";
import { cn } from "@repo/design-system/lib/utils";
import { Chat } from "@/features/problem-workspace/chatbot/components/chat";
import type { GetProblemChatMessagesResponse } from "@/features/problem-workspace/chatbot/lib/problem-chat-types";
import { ProblemNotes } from "@/features/problem-workspace/components/problem-notes";

const panelClass =
  "min-h-0 flex-1 overflow-y-auto pr-1 pt-1 outline-none ring-offset-background focus-visible:outline-none";

export function ProblemSideTabs({
  learningNotes,
  problemId,
  initialChatData,
}: {
  learningNotes?: unknown;
  problemId?: string;
  initialChatData?: GetProblemChatMessagesResponse;
}) {
  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <Tabs
        className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden p-2 pt-2"
        defaultValue="chat"
      >
        <TabsList className="h-auto w-full min-w-0 shrink-0 flex-wrap justify-start gap-1 sm:flex-nowrap">
          <TabsTrigger className="shrink-0" value="chat">
            Chat
          </TabsTrigger>
          <TabsTrigger className="shrink-0" value="notes">
            Notes
          </TabsTrigger>
        </TabsList>
        <TabsContent
          className={cn(panelClass, "flex min-h-0 flex-col")}
          value="chat"
        >
          <Chat initialChatData={initialChatData} problemId={problemId} />
        </TabsContent>
        <TabsContent className={panelClass} value="notes">
          <ProblemNotes learningNotes={learningNotes} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
