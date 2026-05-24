import type { StarterCodeRow } from "../types";

import { firstStarterFunctionName } from "./workspace";

/**
 * Resolve which starter snippet local Run evaluates (matches visible editor selection).
 */

export function resolveRunStarterRow(
  rows: StarterCodeRow[],
  activeStarterKey: string
): StarterCodeRow | null {
  if (rows.length === 0) {
    return null;
  }
  return rows.find((r) => r.key === activeStarterKey) ?? rows[0] ?? null;
}

/** Editor source fed to `runClientTests` for the chosen starter row. */
export function runSourceForStarterRow(
  row: StarterCodeRow | null,
  drafts: Record<string, string>
): string {
  if (row === null) {
    return "";
  }
  return drafts[row.key] ?? "";
}

/** Entry symbol for `new Function`: active row’s name, else first named starter in the problem. */
export function entryFunctionNameForRun(
  row: StarterCodeRow | null,
  rows: StarterCodeRow[]
): string {
  const direct = row?.functionName?.trim();
  if (direct !== undefined && direct.length > 0) {
    return direct;
  }
  return firstStarterFunctionName(rows);
}
