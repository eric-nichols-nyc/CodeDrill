"use client";

/**
 * Problem workspace shell: starter editors (Monaco), Run/Submit actions, and the
 * output split (see `ProblemOutputPanel`). State and handlers live in
 * `useProblemWorkspace`.
 */

import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import { Play, Send } from "lucide-react";
import { SplitLayout } from "@/components/split-layout";
import { JsonFallback } from "@/features/problem-detail/components/json-fallback";
import { useProblemWorkspace } from "./hooks/use-problem-workspace";
import { MonacoSolutionEdtor } from "./monaco-solution-edtor";
import { ProblemOutputPanel } from "./problem-output-panel";

/** Right-hand pane of the problem page: code editing + console / testcase / results tabs. */
export function ProblemWorkspace({
  starterCode,
  testCases,
}: {
  starterCode: unknown;
  testCases?: unknown;
}) {
  const {
    rows,
    drafts,
    setDraftForKey,
    consoleEntries,
    activeTab,
    setActiveTab,
    lastAction,
    lastRunOutcome,
    isPending,
    totalChars,
    handleRun,
    handleSubmit,
  } = useProblemWorkspace({ starterCode, testCases });

  const starterBody = (() => {
    if (rows.length === 0) {
      return (
        <div className="min-h-0 flex-1 overflow-auto">
          <JsonFallback data={starterCode} />
        </div>
      );
    }

    if (rows.length === 1) {
      const row = rows[0];
      return (
        <MonacoSolutionEdtor
          className="h-full"
          onChange={(nextValue) => setDraftForKey(row.key, nextValue)}
          value={drafts[row.key] ?? ""}
        />
      );
    }

    return (
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="space-y-4">
          {rows.map((row) => (
            <MonacoSolutionEdtor
              key={row.key}
              onChange={(nextValue) => setDraftForKey(row.key, nextValue)}
              value={drafts[row.key] ?? ""}
            />
          ))}
        </div>
      </div>
    );
  })();

  const starterPanel = (
    <div className="flex h-full min-h-0 flex-col p-4 pl-3">
      <div className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-muted/20 px-3 py-2">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <h2 className="font-medium text-sm">Workspace</h2>
          <Badge variant="outline">
            {rows.length} file{rows.length === 1 ? "" : "s"}
          </Badge>
          <Badge variant="outline">{totalChars} chars</Badge>
          {rows[0] ? <Badge variant="outline">{rows[0].language}</Badge> : null}
        </div>
        <div className="flex items-center gap-2">
          <Button disabled={isPending} onClick={handleRun} size="sm" variant="outline">
            <Play />
            Run
          </Button>
          <Button disabled={isPending} onClick={handleSubmit} size="sm">
            <Send />
            Submit
          </Button>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {starterBody}
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
          consoleEntries={consoleEntries}
          isBusy={isPending}
          lastAction={lastAction}
          lastRunOutcome={lastRunOutcome}
          onTabChange={setActiveTab}
          testCases={testCases}
        />
      }
    />
  );
}
