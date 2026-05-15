import type { Problem } from "../../lib/types";
import type { ProblemListFilterRow } from "../lib/types";

export type ProblemsListQuery = {
  search: string;
  filterRows: ProblemListFilterRow[];
};

function problemMatchesFilterRows(
  problem: Problem,
  rows: ProblemListFilterRow[]
): boolean {
  for (const row of rows) {
    const v = row.value.trim();
    if (!v) {
      continue;
    }
    switch (row.field) {
      case "difficulty":
        if (problem.difficulty !== v) {
          return false;
        }
        break;
      case "status":
        if (problem.status !== v) {
          return false;
        }
        break;
      case "topic":
        if (!problem.tags.includes(v)) {
          return false;
        }
        break;
      default:
        break;
    }
  }
  return true;
}

export function problemMatchesProblemsListQuery(
  problem: Problem,
  query: ProblemsListQuery
): boolean {
  const q = query.search.trim().toLowerCase();
  if (q && !problem.title.toLowerCase().includes(q)) {
    return false;
  }
  return problemMatchesFilterRows(problem, query.filterRows);
}
