"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { ProblemsListToolbar } from "@/features/problems-page/problems-list/components/problems-list-toolbar";
import { useProblemsListFilterRows } from "@/features/problems-page/problems-list/hooks/use-problems-list-filter-rows";
import { problemMatchesProblemsListQuery } from "@/features/problems-page/problems-list/utils/matches-problems-list-query";
import { sortProblems } from "@/features/problems-page/problems-list/utils/sort-problems";
import type {
  Problem,
  SortDirection,
  SortField,
} from "@/features/problems-page/lib/types";
import { NavDrawerProblemRow } from "./nav-drawer-problem-row";

export type NavDrawerProblemListProps = {
  problems: Problem[];
  currentSlug: string;
  fetchOk: boolean;
  fetchStatus: number;
  onNavigate?: () => void;
};

export function NavDrawerProblemList({
  problems,
  currentSlug,
  fetchOk,
  fetchStatus,
  onNavigate,
}: NavDrawerProblemListProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const {
    rows: filterRows,
    addRow: onFilterAddRow,
    removeRow: onFilterRemoveRow,
    updateRow: onFilterUpdateRow,
    reset: onFilterReset,
    activeCount: filterActiveCount,
  } = useProblemsListFilterRows();

  const availableTopics = useMemo(() => {
    const tagSet = new Set<string>();
    for (const problem of problems) {
      for (const tag of problem.tags) {
        tagSet.add(tag);
      }
    }
    return [...tagSet].sort((a, b) => a.localeCompare(b));
  }, [problems]);

  const listQuery = useMemo(
    () => ({ search, filterRows }),
    [search, filterRows]
  );

  const filteredProblems = useMemo(
    () =>
      problems.filter((problem) =>
        problemMatchesProblemsListQuery(problem, listQuery)
      ),
    [problems, listQuery]
  );

  const sortedProblems = useMemo(
    () => sortProblems(filteredProblems, sortField, sortDirection),
    [filteredProblems, sortField, sortDirection]
  );

  const handleSortChange = useCallback(
    (field: SortField, direction: SortDirection) => {
      setSortField(field);
      setSortDirection(direction);
    },
    []
  );

  const handleRandomProblem = useCallback(() => {
    if (sortedProblems.length === 0) {
      return;
    }
    const randomIndex = Math.floor(Math.random() * sortedProblems.length);
    const randomProblem = sortedProblems[randomIndex];
    if (!randomProblem) {
      return;
    }
    onNavigate?.();
    router.push(`/problems/${encodeURIComponent(randomProblem.slug)}`);
  }, [onNavigate, router, sortedProblems]);

  if (!fetchOk) {
    return (
      <p className="px-4 py-6 text-muted-foreground text-sm">
        Could not load problems (HTTP {fetchStatus}).
      </p>
    );
  }

  if (problems.length === 0) {
    return (
      <p className="px-4 py-6 text-muted-foreground text-sm">
        No problems loaded.
      </p>
    );
  }

  return (
    <>
      <div className="shrink-0 border-border border-b px-4 py-3">
        <ProblemsListToolbar
          availableTopics={availableTopics}
          className="flex-col items-stretch gap-3"
          filterActiveCount={filterActiveCount}
          filteredCount={filteredProblems.length}
          filterRows={filterRows}
          onFilterAddRow={onFilterAddRow}
          onFilterRemoveRow={onFilterRemoveRow}
          onFilterReset={onFilterReset}
          onFilterUpdateRow={onFilterUpdateRow}
          onRandomProblem={handleRandomProblem}
          onSearchChange={setSearch}
          onSortChange={handleSortChange}
          search={search}
          sortDirection={sortDirection}
          sortField={sortField}
        />
      </div>

      {sortedProblems.length === 0 ? (
        <p className="px-4 py-6 text-center text-muted-foreground text-sm">
          No problems match your filters.
        </p>
      ) : (
        <nav aria-label="Problem catalog" className="min-h-0 flex-1 overflow-y-auto">
          {sortedProblems.map((problem, index) => (
            <NavDrawerProblemRow
              isActive={problem.slug === currentSlug}
              key={problem.slug}
              problem={problem}
              stripeIndex={index}
            />
          ))}
        </nav>
      )}
    </>
  );
}
