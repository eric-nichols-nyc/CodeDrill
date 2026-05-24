"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@repo/design-system/components/ui/resizable";

function DummyPanel({
  title,
  description,
  tone = "muted",
}: {
  title: string;
  description: string;
  tone?: "muted" | "card";
}) {
  return (
    <div
      className={`flex h-full min-h-0 flex-col overflow-hidden ${
        tone === "card" ? "bg-card text-card-foreground" : "bg-muted/30"
      }`}
    >
      <div className="border-border border-b p-1">
        <h2 className="font-semibold text-sm">{title}</h2>
        <p className="mt-1 text-muted-foreground text-sm">{description}</p>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-1 font-mono text-muted-foreground text-xs">
        Drag the handles to resize this panel.
      </div>
    </div>
  );
}

export function DashboardResizableDemo() {
  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-background">
      <header className="shrink-0 border-border border-b px-6 py-4">
        <h1 className="font-semibold text-lg tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Dummy layout using design-system resizable panels.
        </p>
      </header>

      <div className="min-h-0 flex-1 overflow-hidden p-1">
        <ResizablePanelGroup
          autoSaveId="codedrill-dashboard-demo"
          className="h-full min-h-0"
          direction="horizontal"
        >
          <ResizablePanel
            className="min-h-0 min-w-0 overflow-hidden"
            defaultSize={22}
            maxSize={35}
            minSize={14}
          >
            <DummyPanel
              description="Sidebar-style panel for navigation or filters."
              title="Left rail"
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel
            className="min-h-0 min-w-0 overflow-hidden"
            defaultSize={56}
            minSize={40}
          >
            <ResizablePanelGroup
              className="h-full min-h-0"
              direction="vertical"
            >
              <ResizablePanel
                className="min-h-0 overflow-hidden"
                defaultSize={62}
                minSize={35}
              >
                <DummyPanel
                  description="Main workspace area — editor, charts, or tables."
                  title="Primary content"
                  tone="card"
                />
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel
                className="min-h-0 overflow-hidden"
                defaultSize={38}
                minSize={20}
              >
                <DummyPanel
                  description="Logs, output, or secondary details."
                  title="Bottom panel"
                />
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
            <DummyPanel
              description="Chat, notes, or contextual help."
              title="Right sidebar"
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
