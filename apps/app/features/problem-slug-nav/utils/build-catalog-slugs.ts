import type { ApiProblemRow } from "@/features/problems-page/lib/map-rows-to-problems";
import { mapRowsToProblems } from "@/features/problems-page/lib/map-rows-to-problems";
import { sortProblems } from "@/features/problems-page/problems-list/utils/sort-problems";

/** Default catalog order for prev/next on the problem workspace (matches problems list default). */
export function buildCatalogSlugs(rows: ApiProblemRow[]): string[] {
  const problems = mapRowsToProblems(rows);
  const sorted = sortProblems(problems, "id", "asc");
  return sorted.map((p) => p.slug);
}
