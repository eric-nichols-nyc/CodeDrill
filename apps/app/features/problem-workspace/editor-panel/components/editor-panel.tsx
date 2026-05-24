"use client";

import { ShellPanel } from "@/features/problem-workspace/shell/shell-panel";
import { useWorkspace } from "@/features/problem-workspace/shell/workspace-provider";

export function EditorPanel() {
  const { workspace } = useWorkspace();

  return (
    <ShellPanel className="bg-card text-card-foreground">
      <div className="border-border border-b p-1">
        <h2 className="font-semibold text-sm">Editor panel</h2>
        <p className="text-muted-foreground text-xs">
          Monaco migrates here next.
        </p>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-1 font-mono text-muted-foreground text-xs">
        {workspace.rows.length} starter file
        {workspace.rows.length === 1 ? "" : "s"} · {workspace.totalChars} chars
      </div>
    </ShellPanel>
  );
}
