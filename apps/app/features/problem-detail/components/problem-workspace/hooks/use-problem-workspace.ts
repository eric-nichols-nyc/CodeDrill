"use client";

/**
 * Centralizes workspace state: normalized starter rows, per-file draft text,
 * output tabs, console log, and last local test run. Resets when `starterCode`
 * yields new `rows` (problem or API payload changed).
 */

import { runClientTests, type RunClientTestsOutcome } from "@/features/problem-detail/client-test-run";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import type { ConsoleEntry } from "../types";
import {
  buildInitialDrafts,
  combineStarterDrafts,
  firstStarterFunctionName,
  formatConsoleTimeLabel,
  toStarterCodeRows,
  totalDraftChars,
} from "../utils/workspace";

/** @returns Everything the workspace UI needs; keeps `ProblemWorkspace` mostly presentational. */
export function useProblemWorkspace({
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

  /** New problem / starter list → reset drafts, console, and last run snapshot. */
  useEffect(() => {
    setDrafts(buildInitialDrafts(rows));
    setConsoleEntries([]);
    setLastAction(null);
    setLastRunOutcome(null);
  }, [rows]);

  const totalChars = totalDraftChars(rows, drafts);

  const appendConsole = useCallback(
    (level: ConsoleEntry["level"], message: string) => {
      setConsoleEntries((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${prev.length}`,
          createdAt: formatConsoleTimeLabel(),
          level,
          message,
        },
      ]);
    },
    []
  );

  const setDraftForKey = useCallback((key: string, value: string) => {
    setDrafts((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleRun = useCallback(() => {
    setLastAction("run");
    const combinedCode = combineStarterDrafts(rows, drafts);
    const functionName = firstStarterFunctionName(rows);
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
  }, [drafts, rows, testCases]);

  const handleSubmit = useCallback(() => {
    setActiveTab("results");
    setLastAction("submit");
    const charsAtSubmit = totalDraftChars(rows, drafts);
    const fileCount = rows.length;
    startTransition(() => {
      appendConsole(
        "info",
        `Submit queued with ${fileCount} file${fileCount === 1 ? "" : "s"} and ${charsAtSubmit} chars of code.`
      );
      appendConsole(
        "success",
        "Submission UI is ready. Hook this button to the judge when your endpoint is in place."
      );
    });
  }, [appendConsole, drafts, rows]);

  return {
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
  };
}
