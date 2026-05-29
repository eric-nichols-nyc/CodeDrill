"use client";

/**
 * Output region beside the editor: Testcase (official cases) and Test Result
 * (per-case Input / Stdout / Output / Expected after Run).
 */

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/design-system/components/ui/tabs";
import { CheckSquare, Terminal } from "lucide-react";
import { useMemo } from "react";
import { useWorkspace } from "@/features/problem-workspace/components/shell/workspace-provider";
import { normalizeProblemTestCases } from "@/features/problem-workspace/lib/client-test-run";

import { TestcasePanel } from "./testcase-panel";
import { TestResultPanel } from "./test-result-panel";

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
    <div className="flex min-h-0 flex-1 items-center justify-center p-4">
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
}

/** Right-hand Output column: Testcase / Test Result tabs. */
export function ProblemOutputPanel() {
  const { data, workspace } = useWorkspace();
  const {
    activeTab,
    lastAction,
    lastRunOutcome,
    setActiveTab,
  } = workspace;

  const testCaseRows = useMemo(
    () => normalizeProblemTestCases(data.testCases ?? null),
    [data.testCases]
  );

  return (
    <div className="flex h-full min-h-0 flex-col p-2">
      <Tabs
        className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-border bg-muted/20"
        onValueChange={setActiveTab}
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
          className="mt-0 min-h-0 flex-1 overflow-y-auto"
          value="testcase"
        >
          <TestcasePanel testCaseRows={testCaseRows} />
        </TabsContent>

        <TabsContent
          className="mt-0 min-h-0 flex-1 overflow-y-auto"
          value="test-result"
        >
          {lastRunOutcome !== null && lastAction === "run" ? (
            <TestResultPanel
              outcome={lastRunOutcome}
              testCaseRows={testCaseRows}
            />
          ) : (
            <ResultsPlaceholder lastAction={lastAction} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
