"use client";

import { WorkspaceShell } from "@/features/problem-workspace/shell/workspace-shell";

export function DashboardResizableDemo() {
  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-background">
      <header className="shrink-0 border-border border-b px-6 py-4">
        <h1 className="font-semibold text-lg tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Dummy layout using design-system resizable panels.
        </p>
      </header>

      <WorkspaceShell autoSaveId="codedrill-dashboard-demo" />
    </div>
  );
}
