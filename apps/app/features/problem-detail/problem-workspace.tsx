"use client";

import { Play, Send } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { SplitLayout } from "@/components/split-layout";
import { Button } from "@repo/design-system/components/ui/button";
import { Badge } from "@repo/design-system/components/ui/badge";
import { JsonFallback } from "@/features/problem-detail/json-fallback";
import {
  asRecord,
  rowKey,
  strField,
} from "@/features/problem-detail/problem-detail-helpers";
import { ProblemOutputPanel } from "@/features/problem-detail/problem-output-panel";
import { SolutionEditor } from "@/features/problem-detail/solution-editor";

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

function formatConsoleValue(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Error) {
    return value.stack ?? value.message;
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function runJavaScript(code: string) {
  const logs: string[] = [];
  const originalConsole = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
  };

  const capture = (...args: unknown[]) => {
    logs.push(args.map((arg) => formatConsoleValue(arg)).join(" "));
  };

  console.log = capture;
  console.info = capture;
  console.warn = capture;
  console.error = capture;

  try {
    const runner = new Function(code);
    runner();
    return {
      ok: true as const,
      logs,
    };
  } catch (error) {
    return {
      ok: false as const,
      logs,
      error: formatConsoleValue(error),
    };
  } finally {
    console.log = originalConsole.log;
    console.info = originalConsole.info;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
  }
}

export function ProblemWorkspace({ starterCode }: { starterCode: unknown }) {
  const rows = useMemo(() => toStarterCodeRows(starterCode), [starterCode]);
  const [drafts, setDrafts] = useState<Record<string, string>>(() =>
    buildInitialDrafts(rows)
  );
  const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([]);
  const [activeTab, setActiveTab] = useState("console");
  const [lastAction, setLastAction] = useState<"run" | "submit" | null>(null);
  const [isPending, startTransition] = useTransition();

  const workspaceSignature = useMemo(
    () => rows.map((row) => `${row.key}:${row.code ?? ""}`).join("||"),
    [rows]
  );

  useEffect(() => {
    setDrafts(buildInitialDrafts(rows));
    setConsoleEntries([]);
    setLastAction(null);
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
    setActiveTab("console");
    setLastAction("run");
    startTransition(() => {
      appendConsole(
        "info",
        `Run requested for ${rows.length} file${rows.length === 1 ? "" : "s"} (${totalChars} chars).`
      );

      if (rows.length === 0) {
        appendConsole("error", "Nothing to run because no starter files were loaded.");
        return;
      }

      const unsupported = rows.filter((row) => {
        const language = row.language.toLowerCase();
        return language !== "javascript" && language !== "js";
      });

      if (unsupported.length > 0) {
        appendConsole(
          "error",
          `Local Run currently supports JavaScript only. Unsupported languages: ${unsupported
            .map((row) => row.language)
            .join(", ")}.`
        );
        return;
      }

      const combinedCode = rows.map((row) => drafts[row.key] ?? "").join("\n\n");
      const result = runJavaScript(combinedCode);

      for (const log of result.logs) {
        appendConsole("success", log);
      }

      if (!result.ok) {
        appendConsole("error", result.error);
        return;
      }

      if (result.logs.length === 0) {
        const namedFunction = rows.find((row) => row.functionName);
        if (namedFunction?.functionName) {
          appendConsole(
            "info",
            `Program ran with no console output. ${namedFunction.functionName}(...) is defined, but it was not called.`
          );
          return;
        }

        appendConsole("info", "Program ran successfully with no console output.");
      }
    });
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
        <SolutionEditor
          fillHeight
          onChange={(nextValue) =>
            setDrafts((prev) => ({ ...prev, [row.key]: nextValue }))
          }
          row={row.raw}
          value={drafts[row.key] ?? ""}
        />
      );
    }

    return (
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="space-y-4">
          {rows.map((row) => (
            <SolutionEditor
              key={row.key}
              onChange={(nextValue) =>
                setDrafts((prev) => ({ ...prev, [row.key]: nextValue }))
              }
              row={row.raw}
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
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{starterBody}</div>
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
          onTabChange={setActiveTab}
          rows={rows}
        />
      }
    />
  );
}
