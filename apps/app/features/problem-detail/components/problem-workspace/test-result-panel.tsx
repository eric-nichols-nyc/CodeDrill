"use client";

import { ScrollArea } from "@repo/design-system/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/design-system/components/ui/tabs";
import { Check, X } from "lucide-react";
import { useState } from "react";
import type {
  ClientTestCaseResult,
  ProblemTestCaseView,
  RunClientTestsOutcome,
} from "@/features/problem-detail/client-test-run";

import { TestResultCaseColumn } from "./testcase-field-blocks";

function ResultStatusHeader({ outcome }: { outcome: RunClientTestsOutcome }) {
  if (outcome.compileError) {
    return (
      <div className="shrink-0 border-border/60 border-b px-4 py-3">
        <p className="font-semibold text-destructive text-sm">Compile Error</p>
      </div>
    );
  }

  const label = outcome.allPassed ? "Accepted" : "Wrong Answer";

  return (
    <div className="shrink-0 border-border/60 border-b px-4 py-3">
      <p
        className={
          outcome.allPassed
            ? "font-semibold text-green-600 text-sm dark:text-green-400"
            : "font-semibold text-destructive text-sm"
        }
      >
        {label}
      </p>
    </div>
  );
}

function CaseTabLabel({ passed }: { passed?: boolean }) {
  if (passed === undefined) {
    return null;
  }

  return passed ? (
    <Check aria-hidden className="size-3 text-green-600 dark:text-green-400" />
  ) : (
    <X aria-hidden className="size-3 text-destructive" />
  );
}

function CompileErrorBody({
  message,
  stdoutLines,
}: {
  message: string;
  stdoutLines: RunClientTestsOutcome["userConsole"];
}) {
  const stdout = stdoutLines.map((line) => line.message).join("\n");

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-5 p-4">
        <section className="flex flex-col gap-2">
          <span className="font-medium text-muted-foreground text-xs">Error</span>
          <div className="rounded-md border border-border/60 bg-muted/40 px-3 py-2.5 font-mono text-destructive text-sm">
            {message}
          </div>
        </section>
        {stdout.length > 0 ? (
          <section className="flex flex-col gap-2">
            <span className="rounded bg-primary/15 px-1.5 py-0.5 font-medium text-primary text-xs">
              Stdout
            </span>
            <div className="rounded-md border border-border/60 bg-muted/40 px-3 py-2.5 font-mono text-foreground text-sm">
              {stdout}
            </div>
          </section>
        ) : null}
      </div>
    </ScrollArea>
  );
}

export function TestResultPanel({
  outcome,
  testCaseRows,
}: {
  outcome: RunClientTestsOutcome;
  testCaseRows: ProblemTestCaseView[];
}) {
  const [activeCase, setActiveCase] = useState("0");

  if (outcome.compileError) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <ResultStatusHeader outcome={outcome} />
        <CompileErrorBody
          message={outcome.compileError}
          stdoutLines={outcome.userConsole}
        />
      </div>
    );
  }

  if (outcome.caseResults.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center p-4">
        <p className="text-muted-foreground text-sm">
          No test cases were returned for this problem, or none could be
          normalized.
        </p>
      </div>
    );
  }

  const resolvedActiveCase =
    Number(activeCase) < outcome.caseResults.length ? activeCase : "0";

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <ResultStatusHeader outcome={outcome} />
      <Tabs
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
        onValueChange={setActiveCase}
        value={resolvedActiveCase}
      >
        <div className="shrink-0 border-border/60 border-b px-3 py-2">
          <TabsList className="h-auto w-full justify-start gap-1 bg-transparent p-0">
            {outcome.caseResults.map((caseResult) => (
              <TabsTrigger
                className="h-7 shrink-0 gap-1 rounded-md px-2.5 text-xs data-[state=active]:bg-muted data-[state=active]:shadow-none"
                key={caseResult.index}
                value={String(caseResult.index)}
              >
                <CaseTabLabel passed={caseResult.passed} />
                Case {caseResult.index + 1}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {outcome.caseResults.map((caseResult) => (
          <CaseResultContent
            caseResult={caseResult}
            key={caseResult.index}
            stdoutLines={outcome.userConsole}
            testCaseRows={testCaseRows}
          />
        ))}
      </Tabs>
    </div>
  );
}

function CaseResultContent({
  caseResult,
  testCaseRows,
  stdoutLines,
}: {
  caseResult: ClientTestCaseResult;
  testCaseRows: ProblemTestCaseView[];
  stdoutLines: RunClientTestsOutcome["userConsole"];
}) {
  const input = testCaseRows[caseResult.index]?.input ?? "";

  return (
    <TabsContent
      className="mt-0 min-h-0 flex-1 overflow-hidden"
      value={String(caseResult.index)}
    >
      <ScrollArea className="h-full">
        <TestResultCaseColumn
          expected={caseResult.expectedDisplay}
          input={input}
          output={caseResult.actualDisplay}
          passed={caseResult.passed}
          runtimeError={caseResult.error}
          stdoutLines={stdoutLines}
        />
      </ScrollArea>
    </TabsContent>
  );
}
