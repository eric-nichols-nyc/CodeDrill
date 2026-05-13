"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@repo/design-system/components/ui/resizable";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { problemMatchesFilters } from "../lib/problem-matches-filters";
import type {
  Difficulty,
  Problem,
  SortDirection,
  SortField,
  Status,
} from "../lib/types";
import { Calendar } from "./calendar";
import { ProblemFilters } from "./problem-filters";
import { ProblemTable } from "./problem-table";
import { ProblemsHeader } from "./problems-header";
import { ProblemsNavSidebar } from "./problems-nav-sidebar";
import { ProblemsPagination } from "./problems-pagination";
import { ProblemsPromoCarousel } from "./problems-promo-carousel";
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
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [status, setStatus] = useState<Status | "all">("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    for (const p of initialProblems) {
      for (const t of p.tags) {
        tagSet.add(t);
      }
    }
    return [...tagSet].sort((a, b) => a.localeCompare(b));
  }, [initialProblems]);

  const filterState = useMemo(
    () => ({ search, difficulty, status, selectedTags }),
    [search, difficulty, status, selectedTags]
  );

  const filteredProblems = useMemo(
    () => initialProblems.filter((p) => problemMatchesFilters(p, filterState)),
    [initialProblems, filterState]
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

  let tableSection: React.ReactNode;
  if (!fetchOk) {
    tableSection = (
      <p className="p-6 text-center text-muted-foreground text-sm">
        Problems list unavailable. Fix the connection issue above, then refresh
        the page.
      </p>
    );
  } else if (initialProblems.length === 0) {
    tableSection = (
      <p className="p-6 text-center text-muted-foreground text-sm">
        No problems yet.
      </p>
    );
  } else if (filteredProblems.length === 0) {
    tableSection = (
      <p className="p-6 text-center text-muted-foreground text-sm">
        No problems match your filters.
      </p>
    );
  } else {
    tableSection = (
      <ProblemTable
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
            className="flex min-h-0 min-w-0 flex-col overflow-hidden"
            defaultSize={80}
            minSize={52}
          >
            <main className="min-h-0 min-w-0 flex-1 overflow-auto p-4">
              <div className="mx-auto max-w-5xl">
                {fetchOk ? null : (
                  <p className="mb-4 text-destructive text-sm">
                    Could not load problems (HTTP {fetchStatus}). For
                    server-side access from this app, set matching{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">
                      INTERNAL_PROBLEMS_SECRET
                    </code>{" "}
                    here and on the Nest API, or call the API with a Better Auth
                    session cookie.
                  </p>
                )}

                <div className="mb-4 flex flex-wrap items-center gap-4 border-border border-b pb-3">
                  <button
                    className="border-primary border-b-2 pb-2 font-medium text-foreground text-sm"
                    type="button"
                  >
                    All topics
                  </button>
                  <button
                    className="pb-2 text-muted-foreground text-sm hover:text-foreground"
                    type="button"
                  >
                    Algorithms
                  </button>
                  <button
                    className="pb-2 text-muted-foreground text-sm hover:text-foreground"
                    type="button"
                  >
                    Database
                  </button>
                  <button
                    className="pb-2 text-muted-foreground text-sm hover:text-foreground"
                    type="button"
                  >
                    Shell
                  </button>
                  <button
                    className="pb-2 text-muted-foreground text-sm hover:text-foreground"
                    type="button"
                  >
                    Concurrency
                  </button>
                </div>

                <ProblemFilters
                  availableTags={availableTags}
                  difficulty={difficulty}
                  onDifficultyChange={setDifficulty}
                  onRandomProblem={handleRandomProblem}
                  onSearchChange={setSearch}
                  onStatusChange={setStatus}
                  onTagsChange={setSelectedTags}
                  search={search}
                  selectedTags={selectedTags}
                  status={status}
                />

                <div className="mt-4 mb-2 flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    {filteredProblems.length} problems
                  </span>
                </div>

                <ProblemsPromoCarousel />

                <div className="overflow-hidden rounded-lg border border-border">
                  {tableSection}
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
