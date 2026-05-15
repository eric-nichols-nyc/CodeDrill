"use client";

/**
 * Workspace hook for the problem page editor + output pane.
 *
 * **Data flow (high level)**
 * - `starterCode` (API-shaped `unknown`) → `toStarterCodeRows` → `rows` (`StarterCodeRow[]`).
 * - Each row has a stable `key`; `drafts[key]` is the live Monaco text for that snippet.
 * - **Saved code**: TanStack Query loads `problem_workspace_code` on mount; merges into drafts by language.
 * - **Run**: evaluates sample cases in the browser, then persists the active file via `useSaveWorkspaceCodeMutation`.
 * - **Submit**: placeholder UX only.
 */

import {
  collapseAdjacentCapturedConsoleLines,
  runClientTests,
  type RunClientTestsOutcome,
} from "@/features/problem-detail/client-test-run";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { isWorkspaceCodeApiError } from "../queries/workspace-code-errors";
import { useSaveWorkspaceCodeMutation } from "../queries/use-save-workspace-code-mutation";
import { useWorkspaceCodeQuery } from "../queries/use-workspace-code-query";
import type { ConsoleEntry } from "../types";
import {
  entryFunctionNameForRun,
  resolveRunStarterRow,
  runSourceForStarterRow,
} from "../utils/run-target";
import { mergeSavedCodeIntoDrafts } from "../utils/merge-saved-drafts";
import {
  buildInitialDrafts,
  formatConsoleTimeLabel,
  toStarterCodeRows,
  totalDraftChars,
} from "../utils/workspace";

export function useProblemWorkspace({
  problemId,
  starterCode,
  testCases,
}: {
  problemId?: string;
  starterCode: unknown;
  testCases?: unknown;
}) {
  const rows = useMemo(() => toStarterCodeRows(starterCode), [starterCode]);

  const [drafts, setDrafts] = useState<Record<string, string>>(() =>
    buildInitialDrafts(rows)
  );

  const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([]);
  const [activeTab, setActiveTab] = useState("testcase");
  const [activeStarterKey, setActiveStarterKey] = useState("");
  const [lastAction, setLastAction] = useState<"run" | "submit" | null>(null);
  const [lastRunOutcome, setLastRunOutcome] =
    useState<RunClientTestsOutcome | null>(null);
  const [isPending, startTransition] = useTransition();

  const appliedSavedRef = useRef(false);

  const {
    data: savedEntries = [],
    isLoading: isLoadingSavedCode,
    error: workspaceCodeLoadError,
  } = useWorkspaceCodeQuery(problemId);

  const saveWorkspaceCode = useSaveWorkspaceCodeMutation(problemId);

  useEffect(() => {
    appliedSavedRef.current = false;
    setDrafts(buildInitialDrafts(rows));
    setConsoleEntries([]);
    setLastAction(null);
    setLastRunOutcome(null);
    setActiveStarterKey((prev) => {
      if (rows.length === 0) {
        return "";
      }
      return rows.some((r) => r.key === prev) ? prev : rows[0].key;
    });
  }, [rows]);

  useEffect(() => {
    if (
      isLoadingSavedCode ||
      savedEntries.length === 0 ||
      rows.length === 0 ||
      appliedSavedRef.current
    ) {
      return;
    }

    setDrafts((prev) => mergeSavedCodeIntoDrafts(rows, prev, savedEntries));
    appliedSavedRef.current = true;
  }, [isLoadingSavedCode, rows, savedEntries]);

  const activeRow = useMemo(
    () => resolveRunStarterRow(rows, activeStarterKey),
    [rows, activeStarterKey]
  );

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
    const runRow = resolveRunStarterRow(rows, activeStarterKey);
    const combinedCode = runSourceForStarterRow(runRow, drafts);
    const functionName = entryFunctionNameForRun(runRow, rows);
    console.log("[problem-workspace] Run clicked", {
      starterFileCount: rows.length,
      activeStarterKey: activeStarterKey || "(default first row)",
      functionName: functionName || "(none)",
      combinedCodeLength: combinedCode.length,
      hasTestCases: testCases !== undefined && testCases !== null,
    });
    const outcome = runClientTests(combinedCode, functionName, testCases);
    console.log("[problem-workspace] runClientTests outcome", outcome);

    const runLabel = formatConsoleTimeLabel();
    const runStamp = Date.now();
    const condensed = collapseAdjacentCapturedConsoleLines(outcome.userConsole);
    setConsoleEntries((prev) => {
      if (condensed.length === 0) {
        return prev;
      }
      const appended = condensed.map((line, i) => ({
        id: `${runStamp}-run-${prev.length + i}`,
        createdAt: runLabel,
        level: line.level,
        message: line.message,
      }));
      return [...prev, ...appended];
    });

    setLastRunOutcome(outcome);
    setActiveTab("test-result");

    if (problemId && runRow) {
      const code = drafts[runRow.key] ?? "";
      saveWorkspaceCode.mutate(
        { language: runRow.language, code },
        {
          onError: (error) => {
            let message = "Could not save code.";
            if (isWorkspaceCodeApiError(error)) {
              message = error.userMessage;
            } else if (error instanceof Error) {
              message = error.message;
            }
            appendConsole("error", message);
            setActiveTab("test-result");
          },
        }
      );
    }
  }, [
    activeStarterKey,
    appendConsole,
    drafts,
    problemId,
    rows,
    saveWorkspaceCode,
    testCases,
  ]);

  const handleSubmit = useCallback(() => {
    setActiveTab("test-result");
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
    activeRow,
    activeStarterKey,
    setActiveStarterKey,
    totalChars,
    consoleEntries,
    activeTab,
    setActiveTab,
    lastAction,
    lastRunOutcome,
    isPending,
    isSavingCode: saveWorkspaceCode.isPending,
    isLoadingSavedCode,
    workspaceCodeLoadError: workspaceCodeLoadError ?? null,
    workspaceCodeSaveError: saveWorkspaceCode.error ?? null,
    clearWorkspaceCodeSaveError: () => saveWorkspaceCode.reset(),
    handleRun,
    handleSubmit,
  };
}
