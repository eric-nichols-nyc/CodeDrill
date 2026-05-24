"use client";

import { ShellPanel } from "@/features/problem-workspace/shell/shell-panel";
import { useWorkspace } from "@/features/problem-workspace/shell/workspace-provider";
import { ProblemOutputPanel } from "./problem-output-panel";

export function OutputPanel() {
  const { data, workspace } = useWorkspace();

  return (
    <ShellPanel>
      <ProblemOutputPanel
        activeTab={workspace.activeTab}
        lastAction={workspace.lastAction}
        lastRunOutcome={workspace.lastRunOutcome}
        onTabChange={workspace.setActiveTab}
        testCases={data.testCases}
      />
    </ShellPanel>
  );
}
