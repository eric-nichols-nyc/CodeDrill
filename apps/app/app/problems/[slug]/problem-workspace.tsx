"use client";

import { ChatPanel } from "@/features/problem-workspace/chat-note-panel/components/chat-panel";
import { DirectionsPanel } from "@/features/problem-workspace/directions-panel/components/directions-panel";
import { EditorPanel } from "@/features/problem-workspace/editor-panel/components/editor-panel";
import { OutputPanel } from "@/features/problem-workspace/output-panel/components/output-panel";
import type { WorkspaceData } from "@/features/problem-workspace/shell/lib/workspace-data";
import { WorkspaceShell } from "@/features/problem-workspace/shell/workspace-shell";
import { WorkspaceProvider } from "@/features/problem-workspace/shell/workspace-provider";

export function ProblemWorkspace({ data }: { data: WorkspaceData }) {
  return (
    <WorkspaceProvider data={data}>
      <WorkspaceShell
        autoSaveId="codedrill-problem-workspace"
        chat={<ChatPanel />}
        directions={<DirectionsPanel />}
        editor={<EditorPanel />}
        output={<OutputPanel />}
      />
    </WorkspaceProvider>
  );
}
