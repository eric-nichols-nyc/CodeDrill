import type { ProblemListFilterRow } from "../lib/types";

function newRowId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `row-${Math.random().toString(36).slice(2)}`;
}

export function createFilterRow(
  partial?: Partial<Omit<ProblemListFilterRow, "id">>
): ProblemListFilterRow {
  return {
    id: newRowId(),
    field: partial?.field ?? "difficulty",
    operator: partial?.operator ?? "is",
    value: partial?.value ?? "",
  };
}
