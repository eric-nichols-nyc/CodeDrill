"use client";

/**
 * Workspace hook for the problem page editor + output pane.
 *
 * **Data flow (high level)**
 * - `starterCode` (API-shaped `unknown`) → `toStarterCodeRows` → `rows` (`StarterCodeRow[]`).
 * - Each row has a stable `key`; `drafts[key]` is the live Monaco text for that snippet.
 * **Run**: evaluates only the active starter row, wraps `console.log`/`warn`/`error` during
 *   evaluation and testcase invocation; those strings are appended to **`consoleEntries`** while
 *   structured results stay in **`lastRunOutcome`**.
 * - **Submit**: placeholder UX only — appends synthetic lines to `consoleEntries` inside a
 *   transition; does not call a judge yet.
 *
 * **Reset**: when `rows` identity changes (new problem or `starterCode` array changed), drafts
 * are rebuilt from server code and console / run snapshot / `lastAction` are cleared.
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
  useState,
  useTransition,
} from "react";
import type { ConsoleEntry } from "../types";
import {
  entryFunctionNameForRun,
  resolveRunStarterRow,
  runSourceForStarterRow,
} from "../utils/run-target";
import {
  buildInitialDrafts,
  formatConsoleTimeLabel,
  toStarterCodeRows,
  totalDraftChars,
} from "../utils/workspace";

/**
 * Single source of truth for editor rows, drafts, output tabs, faux console, and last Run.
 *
 * @param starterCode - Problem payload field: expected to be an array of starter objects (see
 *   `toStarterCodeRows`); non-arrays yield `rows === []`.
 * @param testCases - Passed through to `runClientTests` on Run; optional.
 */
export function useProblemWorkspace({
  starterCode,
  testCases,
}: {
  starterCode: unknown;
  testCases?: unknown;
}) {
  /* ─── Derived: normalized starter list (not stored in useState; memo from prop) ─── */
  const rows = useMemo(() => toStarterCodeRows(starterCode), [starterCode]);

  /* ─── Editor: one draft string per `row.key` (Monaco onChange → `setDraftForKey`) ─ */
  const [drafts, setDrafts] = useState<Record<string, string>>(() =>
    buildInitialDrafts(rows)
  );

  /* ─── Output pane: Console tab lines (today mostly Submit-driven) ─────────────── */
  const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([]);

  /* ─── Output pane: which tab is visible (`console` | `testcases` | `results`) ─── */
  const [activeTab, setActiveTab] = useState("console");

  /* ─── Editor: which starter row is shown / used for Run (stable key into `rows`) ─ */
  const [activeStarterKey, setActiveStarterKey] = useState("");

  /* ─── Output pane: badge + Results placeholder copy (`run` vs `submit` vs null) ─ */
  const [lastAction, setLastAction] = useState<"run" | "submit" | null>(null);

  /* ─── Output pane: last `runClientTests` result; cleared when `rows` change ─────── */
  const [lastRunOutcome, setLastRunOutcome] =
    useState<RunClientTestsOutcome | null>(null);

  /* ─── Submit path: `isPending` true while transition callbacks run ─────────────── */
  const [isPending, startTransition] = useTransition();

  /**
   * `rows` changes ⇒ new problem or starter list from server.
   * Re-seed drafts from normalized `row.code`, wipe ephemeral output state.
   * (Does not preserve in-progress edits across navigation — intentional for now.)
   */
  useEffect(() => {
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

  const activeRow = useMemo(
    () => resolveRunStarterRow(rows, activeStarterKey),
    [rows, activeStarterKey]
  );

  /* ─── Toolbar / submit copy: total characters across all draft files ───────────── */
  const totalChars = totalDraftChars(rows, drafts);

  /** Append synthetic info/success lines, or captured user log/warn/error lines from Run. */
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

  /** Update a single file’s draft by stable `StarterCodeRow.key`. */
  const setDraftForKey = useCallback((key: string, value: string) => {
    setDrafts((prev) => ({ ...prev, [key]: value }));
  }, []);

  /**
   * Local **Run**: evaluate combined user code + official testcases in the browser.
   * Sets `lastAction` to `run`, stores outcome, jumps to Results tab.
   */
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
    setActiveTab("results");
  }, [activeStarterKey, drafts, rows, testCases]);

  /**
   * **Submit** stub: switches to Results, marks `lastAction` submit, queues console messages.
   * Judge / network integration would replace or extend this.
   */
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
    // Editor
    rows,
    drafts,
    setDraftForKey,
    activeRow,
    activeStarterKey,
    setActiveStarterKey,
    totalChars,
    // Output panel
    consoleEntries,
    activeTab,
    setActiveTab,
    lastAction,
    lastRunOutcome,
    isPending,
    // Actions
    handleRun,
    handleSubmit,
  };
}
