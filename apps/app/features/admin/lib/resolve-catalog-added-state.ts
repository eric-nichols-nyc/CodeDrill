import type { AdminProblemCatalogEntry } from "@/features/admin/lib/admin-problem-catalog";
import type { AdminProblemListItem } from "@/features/admin/lib/problem-form-values";

export function normalizeCatalogTitle(title: string): string {
  return title.trim().toLowerCase();
}

export type CatalogAddedState = {
  isAdded: boolean;
  problemId?: string;
};

export function resolveCatalogAddedState(
  entry: AdminProblemCatalogEntry,
  dbProblems: AdminProblemListItem[]
): CatalogAddedState {
  const match = dbProblems.find(
    (problem) =>
      normalizeCatalogTitle(problem.title) ===
      normalizeCatalogTitle(entry.title)
  );

  if (match) {
    return { isAdded: true, problemId: match.id };
  }

  return { isAdded: false };
}
