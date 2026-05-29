import {
  asRecord,
  rowKey,
  strField,
} from "@/features/problem-workspace/directions-panel/lib/problem-detail-helpers";
import type { StarterCodeRow } from "../lib/types";

/**
 * Pure helpers for parsing starter-code payloads, building editor state, and
 * merging drafts for execution. No React imports.
 */

/** Maps API `starterCode` array items into stable row metadata + editor key. */
export function toStarterCodeRows(starterCode: unknown): StarterCodeRow[] {
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

/** Initial Monaco document map: one string per starter `key`. */
export function buildInitialDrafts(
  rows: StarterCodeRow[]
): Record<string, string> {
  return Object.fromEntries(rows.map((row) => [row.key, row.code ?? ""]));
}

/** Human-readable timestamp for synthetic console entries. */
export function formatConsoleTimeLabel(): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date());
}

/** Joins every starter file in order — not used for local Run (only one language executes). */
export function combineStarterDrafts(
  rows: StarterCodeRow[],
  drafts: Record<string, string>
): string {
  return rows.map((row) => drafts[row.key] ?? "").join("\n\n");
}

/** First named function on any starter row (used as judge entry point). */
export function firstStarterFunctionName(rows: StarterCodeRow[]): string {
  return rows.find((row) => row.functionName)?.functionName ?? "";
}

/** Sum of draft lengths across all starter files (toolbar + submit copy). */
export function totalDraftChars(
  rows: StarterCodeRow[],
  drafts: Record<string, string>
): number {
  return rows.reduce((sum, row) => sum + (drafts[row.key] ?? "").length, 0);
}
