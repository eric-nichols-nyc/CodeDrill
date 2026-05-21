"use client";

import { Badge } from "@repo/design-system/components/ui/badge";
import { cn } from "@repo/design-system/lib/utils";
import Link from "next/link";
import { AdminProblemCatalogFilters } from "@/features/admin/components/admin-problem-catalog-filters";
import {
  type CatalogEntryWithState,
  useAdminProblemCatalogFilter,
} from "@/features/admin/hooks/use-admin-problem-catalog-filter";
import type { AdminProblemListItem } from "@/features/admin/lib/problem-form-values";
import {
  problemListSectionLabel,
  resolveProblemListSectionId,
} from "@/features/problems-page/problems-list/lib/problem-list-sections";

type AdminProblemCatalogPaneProps = {
  dbProblems: AdminProblemListItem[];
};

function catalogSubtitle(entry: CatalogEntryWithState["entry"]): string {
  const sectionLabel = problemListSectionLabel(
    resolveProblemListSectionId(entry.patternSlug)
  );

  if (entry.leetcodeNumber) {
    return `LC ${entry.leetcodeNumber} · ${sectionLabel}`;
  }

  return sectionLabel;
}

function AdminProblemCatalogRow({
  entry,
  isAdded,
  problemId,
}: CatalogEntryWithState) {
  const href = isAdded
    ? `/admin?id=${encodeURIComponent(problemId ?? "")}`
    : `/admin/add?catalogKey=${encodeURIComponent(entry.catalogKey)}`;

  return (
    <Link
      className="block w-full rounded-lg border border-border bg-background px-3 py-3 text-left transition-colors hover:bg-muted/40"
      href={href}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium text-sm">{entry.title}</p>
          <p className="truncate text-muted-foreground text-xs">
            {catalogSubtitle(entry)}
          </p>
        </div>
        <Badge variant="outline">{entry.difficulty}</Badge>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Badge
          className={cn(
            isAdded &&
              "border-emerald-600/40 text-emerald-700 dark:text-emerald-400"
          )}
          variant="outline"
        >
          {isAdded ? "Added" : "Not added"}
        </Badge>
        {isAdded ? null : (
          <span className="text-muted-foreground text-xs">Add template</span>
        )}
      </div>
    </Link>
  );
}

export function AdminProblemCatalogPane({
  dbProblems,
}: AdminProblemCatalogPaneProps) {
  const {
    search,
    setSearch,
    difficulty,
    setDifficulty,
    status,
    setStatus,
    filteredEntries,
    totalCount,
    visibleCount,
  } = useAdminProblemCatalogFilter(dbProblems);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <AdminProblemCatalogFilters
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        search={search}
        status={status}
        totalCount={totalCount}
        visibleCount={visibleCount}
      />

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {filteredEntries.length === 0 ? (
          <p className="px-2 py-4 text-muted-foreground text-sm">
            No catalog items match.
          </p>
        ) : (
          <div className="space-y-2">
            {filteredEntries.map((item) => (
              <AdminProblemCatalogRow key={item.entry.catalogKey} {...item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
