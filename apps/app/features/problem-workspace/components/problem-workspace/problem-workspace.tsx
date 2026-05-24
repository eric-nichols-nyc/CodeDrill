"use client";

/**
 * Problem workspace shell: one Monaco editor (starter language via dropdown when
 * multiple), Run/Submit actions, and the output split (`ProblemOutputPanel`).
 * State and handlers live in `useProblemWorkspace`.
 */

import { Button } from "@repo/design-system/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system/components/ui/select";
import { Play, RotateCcw, Send } from "lucide-react";
import { SplitLayout } from "@/components/split-layout";
import { JsonFallback } from "@/features/problem-workspace/components/json-fallback";
import { useProblemWorkspace } from "./hooks/use-problem-workspace";
import { MonacoSolutionEdtor } from "./monaco-solution-edtor";
import { ProblemOutputPanel } from "./problem-output-panel";
import { WorkspaceCodeStatusBanner } from "./workspace-code-status-banner";

/** Right-hand pane of the problem page: code editing + testcase / test result tabs. */
export function ProblemWorkspace({
  problemId,
  starterCode,
  testCases,
}: {
  problemId?: string;
  starterCode: unknown;
  testCases?: unknown;
}) {
  const {
    rows,
    drafts,
    setDraftForKey,
    activeRow,
    setActiveStarterKey,
    activeTab,
    setActiveTab,
    lastAction,
    lastRunOutcome,
    isPending,
    handleRun,
    handleReset,
    handleSubmit,
    canReset,
    isSavingCode,
    workspaceCodeLoadError,
    workspaceCodeSaveError,
    clearWorkspaceCodeSaveError,
  } = useProblemWorkspace({ problemId, starterCode, testCases });

  const starterBody = (() => {
    if (rows.length === 0) {
      return (
        <div className="min-h-0 flex-1 overflow-auto">
          <JsonFallback data={starterCode} />
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
        <MonacoSolutionEdtor
          className="h-full min-h-0"
          language={activeRow.language}
          onChange={(nextValue) => setDraftForKey(activeRow.key, nextValue)}
          value={drafts[activeRow.key] ?? ""}
        />
      </div>
    );
  })();

  const starterPanel = (
    <div className="flex h-full min-h-0 flex-col p-4 pl-3">
      <WorkspaceCodeStatusBanner
        loadError={workspaceCodeLoadError}
        onDismissSaveError={clearWorkspaceCodeSaveError}
        saveError={workspaceCodeSaveError}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {starterBody}
      </div>
      <div className="mt-3 flex shrink-0 flex-wrap items-center justify-end gap-3 rounded-md border border-border bg-muted/20 px-3 py-2">
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
  );

  return (
    <SplitLayout
      className="h-full min-h-0 w-full flex-1"
      defaultLeftPercent={64}
      left={starterPanel}
      minLeftPx={220}
      minRightPx={180}
      orientation="horizontal"
      right={
        <ProblemOutputPanel
          activeTab={activeTab}
          lastAction={lastAction}
          lastRunOutcome={lastRunOutcome}
          onTabChange={setActiveTab}
          testCases={testCases}
        />
      }
    />
  );
}
