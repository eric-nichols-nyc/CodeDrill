"use client";

import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import { Play, Send } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { SplitLayout } from "@/components/split-layout";
import { JsonFallback } from "@/features/problem-detail/components/json-fallback";
import { MonacoSolutionEdtor } from "@/features/problem-detail/components/monaco-solution-edtor";
import { ProblemOutputPanel } from "@/features/problem-detail/components/problem-output-panel";
import {
  runClientTests,
  type RunClientTestsOutcome,
} from "@/features/problem-detail/client-test-run";
import {
  asRecord,
  rowKey,
  strField,
} from "@/features/problem-detail/problem-detail-helpers";

type StarterCodeRow = {
  key: string;
  raw: unknown;
  language: string;
  functionName: string | null;
  code: string | null;
};

type ConsoleEntry = {
  id: string;
  level: "info" | "success" | "error";
  message: string;
  createdAt: string;
};

function toStarterCodeRows(starterCode: unknown): StarterCodeRow[] {
  if (!Array.isArray(starterCode)) {
    return [];
  }

  return starterCode.map((row, index) => {
    const record = asRecord(row);
    return {
      key: rowKey(record, `sc-${index}`),
      raw: row,
      language: strField(record, "language") ?? "code",
      functionName: strField(record, "functionName"),
      code: strField(record, "code"),
    };
  });
}

function buildInitialDrafts(rows: StarterCodeRow[]) {
  return Object.fromEntries(rows.map((row) => [row.key, row.code ?? ""]));
}

function nowLabel() {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date());
}

export function ProblemWorkspace({
  starterCode,
  testCases,
}: {
  starterCode: unknown;
  testCases?: unknown;
}) {
  const rows = useMemo(() => toStarterCodeRows(starterCode), [starterCode]);
  const [drafts, setDrafts] = useState<Record<string, string>>(() =>
    buildInitialDrafts(rows)
  );
  const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([]);
  const [activeTab, setActiveTab] = useState("console");
  const [lastAction, setLastAction] = useState<"run" | "submit" | null>(null);
  const [lastRunOutcome, setLastRunOutcome] =
    useState<RunClientTestsOutcome | null>(null);
  const [isPending, startTransition] = useTransition();

  const workspaceSignature = useMemo(
    () => rows.map((row) => `${row.key}:${row.code ?? ""}`).join("||"),
    [rows]
  );

  useEffect(() => {
    setDrafts(buildInitialDrafts(rows));
    setConsoleEntries([]);
    setLastAction(null);
    setLastRunOutcome(null);
  }, [workspaceSignature, rows]);

  const totalChars = rows.reduce(
    (sum, row) => sum + (drafts[row.key] ?? "").length,
    0
  );

  function appendConsole(level: ConsoleEntry["level"], message: string) {
    setConsoleEntries((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${prev.length}`,
        createdAt: nowLabel(),
        level,
        message,
      },
    ]);
  }

  function handleRun() {
    setLastAction("run");
    const combinedCode = rows
      .map((row) => drafts[row.key] ?? "")
      .join("\n\n");
    const functionName =
      rows.find((row) => row.functionName)?.functionName ?? "";
    console.log("[problem-workspace] Run clicked", {
      starterFileCount: rows.length,
      functionName: functionName || "(none)",
      combinedCodeLength: combinedCode.length,
      hasTestCases: testCases !== undefined && testCases !== null,
    });
    const outcome = runClientTests(combinedCode, functionName, testCases);
    console.log("[problem-workspace] runClientTests outcome", outcome);
    setLastRunOutcome(outcome);
    setActiveTab("results");
  }

  function handleSubmit() {
    setActiveTab("results");
    setLastAction("submit");
    startTransition(() => {
      appendConsole(
        "info",
        `Submit queued with ${rows.length} file${rows.length === 1 ? "" : "s"} and ${totalChars} chars of code.`
      );
      appendConsole(
        "success",
        "Submission UI is ready. Hook this button to the judge when your endpoint is in place."
      );
    });
  }

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
          onChange={(nextValue) =>
            setDrafts((prev) => ({ ...prev, [row.key]: nextValue }))
          }
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
              onChange={(nextValue) =>
                setDrafts((prev) => ({ ...prev, [row.key]: nextValue }))
              }
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
          rows={rows}
        />
      }
    />
  );
}
