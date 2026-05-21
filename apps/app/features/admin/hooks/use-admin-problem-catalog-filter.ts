"use client";

import { useMemo, useState } from "react";
import { ADMIN_PROBLEM_CATALOG } from "@/features/admin/lib/admin-problem-catalog";
import type { AdminProblemListItem } from "@/features/admin/lib/problem-form-values";
import { resolveCatalogAddedState } from "@/features/admin/lib/resolve-catalog-added-state";

export type CatalogStatusFilter = "all" | "added" | "not-added";

export type CatalogDifficultyFilter = "all" | "easy" | "medium" | "hard";

export type CatalogEntryWithState = {
  entry: (typeof ADMIN_PROBLEM_CATALOG)[number];
  isAdded: boolean;
  problemId?: string;
};

function matchesSearch(
  item: CatalogEntryWithState,
  normalizedSearch: string
): boolean {
  if (!normalizedSearch) {
    return true;
  }

  const { entry } = item;
  const haystack = [
    entry.title,
    entry.catalogKey,
    entry.patternSlug ?? "",
    entry.leetcodeNumber ? `lc ${entry.leetcodeNumber}` : "",
    entry.leetcodeNumber?.toString() ?? "",
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalizedSearch);
}

export function useAdminProblemCatalogFilter(
  dbProblems: AdminProblemListItem[]
) {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<CatalogDifficultyFilter>("all");
  const [status, setStatus] = useState<CatalogStatusFilter>("all");

  const entriesWithState = useMemo<CatalogEntryWithState[]>(
    () =>
      ADMIN_PROBLEM_CATALOG.map((entry) => ({
        entry,
        ...resolveCatalogAddedState(entry, dbProblems),
      })),
    [dbProblems]
  );

  const filteredEntries = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return entriesWithState.filter((item) => {
      if (status === "added" && !item.isAdded) {
        return false;
      }
      if (status === "not-added" && item.isAdded) {
        return false;
      }
      if (difficulty !== "all" && item.entry.difficulty !== difficulty) {
        return false;
      }
      return matchesSearch(item, normalizedSearch);
    });
  }, [difficulty, entriesWithState, search, status]);

  return {
    search,
    setSearch,
    difficulty,
    setDifficulty,
    status,
    setStatus,
    filteredEntries,
    totalCount: ADMIN_PROBLEM_CATALOG.length,
    visibleCount: filteredEntries.length,
  };
}
