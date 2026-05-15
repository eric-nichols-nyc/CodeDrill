import type { ProblemListFilterRow } from "../lib/types";

export function countActiveFilterRows(rows: ProblemListFilterRow[]): number {
  return rows.filter((r) => r.value.trim() !== "").length;
}
