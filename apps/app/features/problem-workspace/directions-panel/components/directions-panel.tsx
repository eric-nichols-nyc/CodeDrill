"use client";

import { ShellPanel } from "@/features/problem-workspace/shell/shell-panel";
import { useWorkspace } from "@/features/problem-workspace/shell/workspace-provider";

export function DirectionsPanel() {
  const { data } = useWorkspace();
  const title =
    typeof data.problem === "object" &&
    data.problem !== null &&
    "title" in data.problem &&
    typeof (data.problem as { title: unknown }).title === "string"
      ? (data.problem as { title: string }).title
      : "Problem";

  return (
    <ShellPanel className="bg-muted/30">
      <div className="border-border border-b p-1">
        <h2 className="font-semibold text-sm">{title}</h2>
        <p className="text-muted-foreground text-xs">
          Directions panel — tabs migrate here next.
        </p>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-1 font-mono text-muted-foreground text-xs">
        Description · Solutions · Editorial
      </div>
    </ShellPanel>
  );
}
