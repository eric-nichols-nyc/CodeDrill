"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system/components/ui/select";
import { Play, RotateCcw, Send } from "lucide-react";
import { JsonFallback } from "@/features/problem-workspace/editor-panel/components/json-fallback";
import { MonacoEditor } from "@/features/problem-workspace/editor-panel/components/monaco-editor";
import { WorkspaceCodeStatusBanner } from "@/features/problem-workspace/editor-panel/components/workspace-code-status-banner";
import { ShellPanel } from "@/features/problem-workspace/shell/shell-panel";
import { useWorkspace } from "@/features/problem-workspace/shell/workspace-provider";

export function EditorPanel() {
  const { data, workspace } = useWorkspace();
  const {
    rows,
    drafts,
    setDraftForKey,
    activeRow,
    setActiveStarterKey,
    isPending,
    handleRun,
    handleReset,
    handleSubmit,
    canReset,
    isSavingCode,
    workspaceCodeLoadError,
    workspaceCodeSaveError,
    clearWorkspaceCodeSaveError,
  } = workspace;

  const starterBody = (() => {
    if (rows.length === 0) {
      return (
        <div className="min-h-0 flex-1 overflow-auto">
          <JsonFallback data={data.starterCode} />
        </div>
      );
    }

    if (!activeRow) {
      return null;
    }

    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-border">
        {rows.length > 1 ? (
          <div className="flex shrink-0 items-center gap-2 border-border border-b bg-muted/20 px-3 py-1.5">
            <Select onValueChange={setActiveStarterKey} value={activeRow.key}>
              <SelectTrigger
                aria-label="Starter language"
                className="h-8 w-[min(14rem,100%)]"
                size="sm"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {rows.map((row) => (
                  <SelectItem key={row.key} value={row.key}>
                    {row.language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
        <MonacoEditor
          className="h-full min-h-0"
          language={activeRow.language}
          onChange={(nextValue) => setDraftForKey(activeRow.key, nextValue)}
          value={drafts[activeRow.key] ?? ""}
        />
      </div>
    );
  })();

  return (
    <ShellPanel className="bg-card text-card-foreground">
      <div className="flex h-full min-h-0 flex-col p-2">
        <WorkspaceCodeStatusBanner
          loadError={workspaceCodeLoadError}
          onDismissSaveError={clearWorkspaceCodeSaveError}
          saveError={workspaceCodeSaveError}
        />
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {starterBody}
        </div>
        <div className="mt-2 flex shrink-0 flex-wrap items-center justify-end gap-3 rounded-md border border-border bg-muted/20 px-3 py-2">
          <div className="flex items-center gap-2">
            <Button
              aria-label="Reset to starter code"
              disabled={isPending || isSavingCode || !canReset}
              onClick={handleReset}
              size="icon"
              type="button"
              variant="outline"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              disabled={isPending || isSavingCode}
              onClick={handleRun}
              size="sm"
              variant="outline"
            >
              <Play />
              Run
            </Button>
            <Button disabled={isPending} onClick={handleSubmit} size="sm">
              <Send />
              Submit
            </Button>
          </div>
        </div>
      </div>
    </ShellPanel>
  );
}
