"use client";

import { ShellPanel } from "@/features/problem-workspace/components/shell/shell-panel";
import { ProblemOutputPanel } from "./problem-output-panel";

export function OutputPanel() {
  return (
    <ShellPanel>
      <ProblemOutputPanel />
    </ShellPanel>
  );
}
