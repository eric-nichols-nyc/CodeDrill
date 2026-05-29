"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@repo/design-system/components/ui/resizable";
import type { ReactNode } from "react";
import { useClientMounted } from "@/hooks/use-client-mounted";
import { ShellPanel } from "./shell-panel";

function PlaceholderPanel({ label }: { label: string }) {
  return (
    <ShellPanel className="bg-muted/30 p-1">
      <p className="font-mono text-muted-foreground text-xs">{label}</p>
    </ShellPanel>
  );
}

/** Static layout shell shown during SSR and before client mount. */
function WorkspaceShellSkeleton() {
  return (
    <div className="min-h-0 flex-1 overflow-hidden p-1">
      <div className="flex h-full min-h-0">
        <div className="min-h-0 min-w-0 overflow-hidden" style={{ flex: "22 1 0" }}>
          <PlaceholderPanel label="Directions panel" />
        </div>
        <div aria-hidden="true" className="w-2 shrink-0 bg-black/5" />
        <div className="flex min-h-0 min-w-0 flex-col overflow-hidden" style={{ flex: "56 1 0" }}>
          <div className="min-h-0 overflow-hidden" style={{ flex: "62 1 0" }}>
            <PlaceholderPanel label="Editor panel" />
          </div>
          <div aria-hidden="true" className="h-2 shrink-0 bg-black/5" />
          <div className="min-h-0 overflow-hidden" style={{ flex: "38 1 0" }}>
            <PlaceholderPanel label="Output panel" />
          </div>
        </div>
        <div aria-hidden="true" className="w-2 shrink-0 bg-black/5" />
        <div className="min-h-0 min-w-0 overflow-hidden" style={{ flex: "22 1 0" }}>
          <PlaceholderPanel label="Chat panel" />
        </div>
      </div>
    </div>
  );
}

export function WorkspaceShell({
  directions,
  editor,
  output,
  chat,
  autoSaveId = "codedrill-workspace-shell",
}: {
  directions?: ReactNode;
  editor?: ReactNode;
  output?: ReactNode;
  chat?: ReactNode;
  autoSaveId?: string;
}) {
  const mounted = useClientMounted();

  if (!mounted) {
    return <WorkspaceShellSkeleton />;
  }

  return (
    <div className="min-h-0 flex-1 overflow-hidden p-1">
      <ResizablePanelGroup
        autoSaveId={autoSaveId}
        className="h-full min-h-0"
        direction="horizontal"
      >
        <ResizablePanel
          className="min-h-0 min-w-0 overflow-hidden"
          defaultSize={22}
          maxSize={35}
          minSize={14}
        >
          {directions ?? <PlaceholderPanel label="Directions panel" />}
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel
          className="min-h-0 min-w-0 overflow-hidden"
          defaultSize={56}
          minSize={40}
        >
          <ResizablePanelGroup className="h-full min-h-0" direction="vertical">
            <ResizablePanel
              className="min-h-0 overflow-hidden"
              defaultSize={62}
              minSize={35}
            >
              {editor ?? <PlaceholderPanel label="Editor panel" />}
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel
              className="min-h-0 overflow-hidden"
              defaultSize={38}
              minSize={20}
            >
              {output ?? <PlaceholderPanel label="Output panel" />}
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel
          className="min-h-0 min-w-0 overflow-hidden"
          defaultSize={22}
          maxSize={32}
          minSize={14}
        >
          {chat ?? <PlaceholderPanel label="Chat panel" />}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
