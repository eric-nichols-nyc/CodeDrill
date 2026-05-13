"use client";

/**
 * Output region beside the editor: Console (log lines), Testcases (official
 * cases from the problem), Results (last `runClientTests` outcome from Run).
 */

import { Badge } from "@repo/design-system/components/ui/badge";
import { ScrollArea } from "@repo/design-system/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/design-system/components/ui/tabs";

import { useMemo } from "react";
import { TimerPanelBar } from "@/components/timer";
import type { RunClientTestsOutcome } from "@/features/problem-detail/client-test-run";
import { normalizeProblemTestCases } from "@/features/problem-detail/client-test-run";

import type { ConsoleEntry } from "./types";

/** Renders compile error, empty state, or per-case expected vs actual. */
function RunResultsBody({ outcome }: { outcome: RunClientTestsOutcome }) {
  if (outcome.compileError) {
    return (
      <div className="rounded-md border border-border/70 bg-background/70 px-3 py-3">
        <p className="font-medium text-destructive">Compile error</p>
        <p className="mt-2 font-mono text-muted-foreground text-xs">
          {outcome.compileError}
        </p>
      </div>
    );
  }

  if (outcome.caseResults.length === 0) {
    return (
      <div className="rounded-md border border-border/70 bg-background/70 px-3 py-3">
        <p className="text-muted-foreground">
          No test cases were returned for this problem, or none could be
          normalized.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border/70 bg-background/70 px-3 py-3">
      <p className="font-medium">
        {outcome.allPassed ? "All tests passed" : "Some tests failed"}
      </p>
      <ul className="mt-3 space-y-3">
        {outcome.caseResults.map((c) => (
          <li
            className="rounded border border-border/50 bg-muted/30 px-2 py-2 font-mono text-xs"
            key={c.index}
          >
            <div className="mb-1 font-medium font-sans text-sm">
              Case {c.index + 1}:{" "}
              <span
                className={
                  c.passed
                    ? "text-green-600 dark:text-green-400"
                    : "text-destructive"
                }
              >
                {c.passed ? "passed" : "failed"}
              </span>
            </div>
            <div className="text-muted-foreground">
              Expected: {c.expectedDisplay ?? "—"}
            </div>
            <div className="text-muted-foreground">
              Actual:{" "}
              {(c.actualDisplay?.length ?? 0) > 0 ? c.actualDisplay : "—"}
            </div>
            {c.error !== undefined && c.error.length > 0 ? (
              <div className="mt-1 text-destructive">{c.error}</div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Shown on Results tab before Run, or when Submit was last. */
function ResultsPlaceholder({
  lastAction,
}: {
  lastAction: "run" | "submit" | null;
}) {
  let message = "Run or submit to populate this panel with real results.";
  if (lastAction === "submit") {
    message = "Submission UI is ready to connect to your judge.";
  } else if (lastAction === "run") {
    message = "Run completed; open this tab after Run to see testcase results.";
  }

  return (
    <div className="rounded-md border border-border/70 bg-background/70 px-3 py-3">
      <p className="font-medium">Workspace status</p>
      <p className="mt-2 text-muted-foreground">{message}</p>
    </div>
  );
}

/** Tabbed output UI driven by `useProblemWorkspace` state. */
export function ProblemOutputPanel({
  activeTab,
  consoleEntries,
  isBusy,
  lastAction,
  lastRunOutcome = null,
  onTabChange,
  testCases,
}: {
  activeTab: string;
  consoleEntries: ConsoleEntry[];
  isBusy: boolean;
  lastAction: "run" | "submit" | null;
  lastRunOutcome?: RunClientTestsOutcome | null;
  onTabChange: (value: string) => void;
  testCases?: unknown;
}) {
  const testCaseRows = useMemo(
    () => normalizeProblemTestCases(testCases ?? null),
    [testCases]
  );
  return (
    <div className="flex h-full min-h-0 flex-col gap-3 p-4 pl-3">
      <div className="flex shrink-0 items-center justify-between gap-3">
        <h2 className="font-medium text-muted-foreground text-sm">Output</h2>
        <div className="flex items-center gap-2">
          {lastAction ? (
            <Badge variant="outline">Last action: {lastAction}</Badge>
          ) : null}
          {isBusy ? <Badge>Working</Badge> : null}
        </div>
      </div>

      <TimerPanelBar />

      <Tabs
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
        onValueChange={onTabChange}
        value={activeTab}
      >
        <TabsList className="h-auto w-full justify-start gap-1">
          <TabsTrigger className="shrink-0" value="console">
            Console
          </TabsTrigger>
          <TabsTrigger className="shrink-0" value="testcases">
            Testcases
          </TabsTrigger>
          <TabsTrigger className="shrink-0" value="results">
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent
          className="min-h-0 flex-1 overflow-hidden rounded-md border border-border bg-muted/20"
          value="console"
        >
          <ScrollArea className="h-full">
            <div className="space-y-3 p-3 font-mono text-xs leading-6">
              {consoleEntries.length > 0 ? (
                consoleEntries.map((entry) => (
                  <div
                    className="rounded-md border border-border/70 bg-background/70 px-3 py-2"
                    key={entry.id}
                  >
                    <div className="mb-1 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                      <span>{entry.level}</span>
                      <span>{entry.createdAt}</span>
                    </div>
                    <p
                      className={
                        entry.level === "error" ? "text-destructive" : ""
                      }
                    >
                      {entry.message}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">
                  Console output will appear here when you run code.
                </p>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent
          className="min-h-0 flex-1 overflow-hidden rounded-md border border-border bg-muted/20"
          value="testcases"
        >
          <ScrollArea className="h-full">
            <div className="p-3 text-sm">
              {testCaseRows.length > 0 ? (
                <ul className="space-y-3">
                  {testCaseRows.map((tc, index) => (
                    <li
                      className="rounded-md border border-border/70 bg-background/70 px-3 py-3"
                      key={`${index}-${tc.input}`}
                    >
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <Badge variant="outline">Case {index + 1}</Badge>
                        {tc.isSample ? (
                          <Badge variant="secondary">Sample</Badge>
                        ) : (
                          <Badge variant="outline">Hidden</Badge>
                        )}
                      </div>
                      <div className="space-y-2 font-mono text-muted-foreground text-xs leading-relaxed">
                        <div>
                          <span className="font-medium font-sans text-foreground text-xs">
                            Input
                          </span>
                          <pre className="mt-0.5 whitespace-pre-wrap break-all">
                            {tc.input}
                          </pre>
                        </div>
                        <div>
                          <span className="font-medium font-sans text-foreground text-xs">
                            Expected
                          </span>
                          <pre className="mt-0.5 whitespace-pre-wrap break-all">
                            {tc.expectedOutput}
                          </pre>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">
                  No test cases are available for this problem.
                </p>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent
          className="min-h-0 flex-1 overflow-hidden rounded-md border border-border bg-muted/20"
          value="results"
        >
          <ScrollArea className="h-full">
            <div className="space-y-3 p-3 text-sm">
              {lastRunOutcome !== null && lastAction === "run" ? (
                <RunResultsBody outcome={lastRunOutcome} />
              ) : (
                <ResultsPlaceholder lastAction={lastAction} />
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
