"use client";

import { ShellPanel } from "@/features/problem-workspace/components/shell/shell-panel";
import { DirectionsContent } from "./directions-content";

export function DirectionsPanel() {
  return (
    <ShellPanel>
      <DirectionsContent />
    </ShellPanel>
  );
}
