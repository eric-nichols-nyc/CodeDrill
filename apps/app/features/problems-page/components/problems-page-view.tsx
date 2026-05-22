"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@repo/design-system/components/ui/resizable";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Problem, SortDirection, SortField } from "../lib/types";
import { ProblemsList } from "../problems-list/components/problems-list";
import { ProblemsListToolbar } from "../problems-list/components/problems-list-toolbar";
import { useProblemsListFilterRows } from "../problems-list/hooks/use-problems-list-filter-rows";
import { problemMatchesProblemsListQuery } from "../problems-list/utils/matches-problems-list-query";
import { Calendar } from "./calendar";
import { ProblemsHeader } from "./problems-header";
import { ProblemsNavSidebar } from "./problems-nav-sidebar";
import { ProblemsPagination } from "./problems-pagination";
import { ProblemsSidebar } from "./problems-sidebar";

type ProblemsPageViewProps = {
  initialProblems: Problem[];
  fetchOk: boolean;
  fetchStatus: number;
};

export function ProblemsPageView({
  initialProblems,
  fetchOk,
  fetchStatus,
}: ProblemsPageViewProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const {
    rows: filterRows,
    addRow: onFilterAddRow,
    removeRow: onFilterRemoveRow,
    updateRow: onFilterUpdateRow,
    reset: onFilterReset,
    activeCount: filterActiveCount,
  } = useProblemsListFilterRows();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value);
      resetPagination();
    },
    [resetPagination]
  );

  const handleFilterAddRow = useCallback(() => {
    onFilterAddRow();
    resetPagination();
  }, [onFilterAddRow, resetPagination]);

  const handleFilterRemoveRow = useCallback(
    (id: string) => {
      onFilterRemoveRow(id);
      resetPagination();
    },
    [onFilterRemoveRow, resetPagination]
  );

  const handleFilterUpdateRow = useCallback(
    (id: string, patch: Parameters<typeof onFilterUpdateRow>[1]) => {
      onFilterUpdateRow(id, patch);
      resetPagination();
    },
    [onFilterUpdateRow, resetPagination]
  );

  const handleFilterReset = useCallback(() => {
    onFilterReset();
    resetPagination();
  }, [onFilterReset, resetPagination]);

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    for (const p of initialProblems) {
      for (const t of p.tags) {
        tagSet.add(t);
      }
    }
    return [...tagSet].sort((a, b) => a.localeCompare(b));
  }, [initialProblems]);

  const listQuery = useMemo(
    () => ({ search, filterRows }),
    [search, filterRows]
  );

  const filteredProblems = useMemo(
    () =>
      initialProblems.filter((p) =>
        problemMatchesProblemsListQuery(p, listQuery)
      ),
    [initialProblems, listQuery]
  );

  const totalPages =
    filteredProblems.length === 0
      ? 1
      : Math.ceil(filteredProblems.length / pageSize);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedProblems = filteredProblems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSortToolbar = (field: SortField, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
  };

  const handleRandomProblem = () => {
    if (filteredProblems.length === 0) {
      return;
    }
    const randomIndex = Math.floor(Math.random() * filteredProblems.length);
    const randomProblem = filteredProblems[randomIndex];
    if (randomProblem) {
      router.push(`/problems/${encodeURIComponent(randomProblem.slug)}`);
    }
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  let listSection: React.ReactNode;
  if (!fetchOk) {
    listSection = (
      <p className="p-6 text-center text-muted-foreground text-sm">
        Problems list unavailable. Fix the connection issue above, then refresh
        the page.
      </p>
    );
  } else if (initialProblems.length === 0) {
    listSection = (
      <p className="p-6 text-center text-muted-foreground text-sm">
        No problems yet.
      </p>
    );
  } else if (filteredProblems.length === 0) {
    listSection = (
      <p className="p-6 text-center text-muted-foreground text-sm">
        No problems match your filters.
      </p>
    );
  } else {
    listSection = (
      <ProblemsList
        onSort={handleSort}
        problems={paginatedProblems}
        sortDirection={sortDirection}
        sortField={sortField}
      />
    );
  }

  return (
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-background">
      <ProblemsHeader className="shrink-0" />

      <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
        <ResizablePanelGroup
          autoSaveId="codedrill-problems-layout"
          className="flex h-full min-h-0 min-w-0 flex-1"
          direction="horizontal"
        >
          <ResizablePanel
            className="flex min-h-0 min-w-0 flex-col overflow-hidden"
            defaultSize={20}
            maxSize={32}
            minSize={12}
          >
            <ProblemsNavSidebar />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel
            className="flex min-h-0 min-w-0 flex-col overflow-hidden bg-background"
            defaultSize={80}
            minSize={52}
          >
            <main className="min-h-0 min-w-0 flex-1 overflow-auto bg-background p-4">
              <div className="mx-auto max-w-5xl">
                {fetchOk ? null : (
                  <p className="mb-4 text-destructive text-sm">
                    {fetchStatus === 0 ? (
                      <>
                        Could not reach the practice API. Start{" "}
                        <code className="rounded bg-muted px-1 py-0.5 text-xs">
                          pnpm dev
                        </code>{" "}
                        in{" "}
                        <code className="rounded bg-muted px-1 py-0.5 text-xs">
                          apps/api
                        </code>{" "}
                        (default{" "}
                        <code className="rounded bg-muted px-1 py-0.5 text-xs">
                          http://localhost:3030
                        </code>
                        ), then refresh.
                      </>
                    ) : (
                      <>
                        Could not load problems (HTTP {fetchStatus}). Ensure the
                        Nest API is running and set optional{" "}
                        <code className="rounded bg-muted px-1 py-0.5 text-xs">
                          INTERNAL_PROBLEMS_SECRET
                        </code>{" "}
                        for server-side catalog access, or sign in for Bearer auth.
                      </>
                    )}
                  </p>
                )}

                <ProblemsListToolbar
                  availableTopics={availableTags}
                  className="mt-2"
                  filterActiveCount={filterActiveCount}
                  filteredCount={filteredProblems.length}
                  filterRows={filterRows}
                  onFilterAddRow={handleFilterAddRow}
                  onFilterRemoveRow={handleFilterRemoveRow}
                  onFilterReset={handleFilterReset}
                  onFilterUpdateRow={handleFilterUpdateRow}
                  onRandomProblem={handleRandomProblem}
                  onSearchChange={handleSearchChange}
                  onSortChange={handleSortToolbar}
                  search={search}
                  sortDirection={sortDirection}
                  sortField={sortField}
                />

                <div className="overflow-hidden rounded-lg border border-border bg-card text-card-foreground">
                  {listSection}
                </div>

                <ProblemsPagination
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={handlePageSizeChange}
                  pageSize={pageSize}
                  totalItems={filteredProblems.length}
                  totalPages={totalPages}
                />
              </div>
            </main>
          </ResizablePanel>
        </ResizablePanelGroup>

        <aside className="hidden min-h-0 w-80 shrink-0 flex-col gap-4 overflow-y-auto border-border border-l bg-muted/20 p-4 lg:flex">
          <Calendar />
          <ProblemsSidebar />
        </aside>
      </div>
    </div>
  );
}
