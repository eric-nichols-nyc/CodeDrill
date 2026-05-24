"use client";

import { ShellPanel } from "@/features/problem-workspace/shell/shell-panel";
import { useWorkspace } from "@/features/problem-workspace/shell/workspace-provider";

export function ChatPanel() {
  const { data } = useWorkspace();

  return (
    <ShellPanel className="bg-muted/30">
      <div className="border-border border-b p-1">
        <h2 className="font-semibold text-sm">Chat panel</h2>
        <p className="text-muted-foreground text-xs">
          Chatbot migrates here next.
        </p>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-1 font-mono text-muted-foreground text-xs">
        {data.problemId ? `problemId: ${data.problemId}` : "No problem id"}
      </div>
    </ShellPanel>
  );
}
