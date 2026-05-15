"use client";

/**
 * Output region beside the editor: Testcase (official cases) and Test Result
 * (run outcome + console; result tab refined in a follow-up).
 */

import { Badge } from "@repo/design-system/components/ui/badge";
import { ScrollArea } from "@repo/design-system/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/design-system/components/ui/tabs";
import { CheckSquare, Terminal } from "lucide-react";
import { useMemo } from "react";
import { TimerPanelBar } from "@/components/timer";
import type { RunClientTestsOutcome } from "@/features/problem-detail/client-test-run";
import { normalizeProblemTestCases } from "@/features/problem-detail/client-test-run";

import { TestcasePanel } from "./testcase-panel";
import type { ConsoleEntry } from "./types";

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

function ResultsPlaceholder({
  lastAction,
}: {
  lastAction: "run" | "submit" | null;
}) {
  let message = "Run or submit to populate this panel with real results.";
  if (lastAction === "submit") {
    message = "Submission UI is ready to connect to your judge.";
  } else if (lastAction === "run") {
    message = "Run completed; open Test Result to see outcomes.";
  }

  return (
    <div className="rounded-md border border-border/70 bg-background/70 px-3 py-3">
      <p className="font-medium">Workspace status</p>
      <p className="mt-2 text-muted-foreground">{message}</p>
    </div>
  );
}

/** Right-hand Output column: header → timer → Testcase / Test Result tabs. */
export function ProblemOutputPanel({
  activeTab,
  consoleEntries: _consoleEntries,
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
        className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-border bg-muted/20"
        onValueChange={onTabChange}
        value={activeTab}
      >
        <div className="shrink-0 border-border/60 border-b px-2 pt-1">
          <TabsList className="h-auto w-full justify-start gap-0 bg-transparent p-0">
            <TabsTrigger
              className="h-8 shrink-0 gap-1.5 rounded-none border-transparent border-b-2 bg-transparent px-3 text-muted-foreground shadow-none data-[state=active]:border-foreground/30 data-[state=active]:bg-muted/50 data-[state=active]:text-foreground data-[state=active]:shadow-none"
              value="testcase"
            >
              <CheckSquare className="size-3.5 text-green-600 dark:text-green-400" />
              Testcase
            </TabsTrigger>
            <TabsTrigger
              className="h-8 shrink-0 gap-1.5 rounded-none border-transparent border-b-2 bg-transparent px-3 text-muted-foreground shadow-none data-[state=active]:border-foreground/30 data-[state=active]:bg-muted/50 data-[state=active]:text-foreground data-[state=active]:shadow-none"
              value="test-result"
            >
              <Terminal className="size-3.5" />
              Test Result
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          className="mt-0 flex min-h-0 flex-1 flex-col overflow-hidden"
          value="testcase"
        >
          <TestcasePanel testCaseRows={testCaseRows} />
        </TabsContent>

        <TabsContent
          className="mt-0 min-h-0 flex-1 overflow-hidden"
          value="test-result"
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
