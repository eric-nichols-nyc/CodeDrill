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
import { useApiAuth } from "@/features/auth/hooks/use-api-auth";
import { EditorRunSubmitAuthPrompt } from "@/features/problem-workspace/components/editor-panel/components/editor-run-submit-auth-prompt";
import { JsonFallback } from "@/features/problem-workspace/components/editor-panel/components/json-fallback";
import { MonacoEditor } from "@/features/problem-workspace/components/editor-panel/components/monaco-editor";
import { ShellPanel } from "@/features/problem-workspace/components/shell/shell-panel";
import { useWorkspace } from "@/features/problem-workspace/components/shell/workspace-provider";

export function EditorPanel() {
  const { data, workspace } = useWorkspace();
  const { isSignedIn } = useApiAuth();
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
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {starterBody}
        </div>
        <div className="mt-2 flex w-full shrink-0 items-center gap-2 rounded-md border border-border bg-muted/20 px-3 py-2">
          {isSignedIn ? (
            <div className="ml-auto flex shrink-0 items-center gap-2">
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
          ) : (
            <EditorRunSubmitAuthPrompt />
          )}
        </div>
      </div>
    </ShellPanel>
  );
}
