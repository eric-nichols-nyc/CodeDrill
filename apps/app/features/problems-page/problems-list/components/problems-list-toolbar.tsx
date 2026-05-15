"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { cn } from "@repo/design-system/lib/utils";
import { Search, Shuffle } from "lucide-react";
import type { SortDirection, SortField } from "../../lib/types";
import type { ProblemListFilterRow } from "../lib/types";
import { ProblemsListFilterPopover } from "./problems-list-filter-popover";
import { ProblemsListSortPopover } from "./problems-list-sort-popover";

export type ProblemsListToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  filteredCount: number;
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField, direction: SortDirection) => void;
  filterRows: ProblemListFilterRow[];
  availableTopics: string[];
  filterActiveCount: number;
  onFilterAddRow: () => void;
  onFilterRemoveRow: (id: string) => void;
  onFilterUpdateRow: (
    id: string,
    patch: Partial<Omit<ProblemListFilterRow, "id">>
  ) => void;
  onFilterReset: () => void;
  onRandomProblem: () => void;
  className?: string;
};

export function ProblemsListToolbar({
  search,
  onSearchChange,
  filteredCount,
  sortField,
  sortDirection,
  onSortChange,
  filterRows,
  availableTopics,
  filterActiveCount,
  onFilterAddRow,
  onFilterRemoveRow,
  onFilterUpdateRow,
  onFilterReset,
  onRandomProblem,
  className,
}: ProblemsListToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
        className
      )}
    >
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        <div className="relative min-w-[12rem] max-w-xl flex-1">
          <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="h-10 rounded-full border-border/80 bg-muted/40 pl-10 text-base shadow-none dark:bg-muted/25"
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search problems…"
            type="search"
            value={search}
          />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <ProblemsListSortPopover
            onSortChange={onSortChange}
            sortDirection={sortDirection}
            sortField={sortField}
          />
          <ProblemsListFilterPopover
            activeCount={filterActiveCount}
            availableTopics={availableTopics}
            onAddRow={onFilterAddRow}
            onRemoveRow={onFilterRemoveRow}
            onReset={onFilterReset}
            onUpdateRow={onFilterUpdateRow}
            rows={filterRows}
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-end gap-3 sm:justify-start">
        <div className="text-right sm:text-left">
          <p className="font-semibold text-base text-foreground tabular-nums leading-tight">
            {filteredCount}
          </p>
          <p className="text-muted-foreground text-sm leading-tight">
            Problems
          </p>
        </div>
        <Button
          aria-label="Open random filtered problem"
          className="size-10 shrink-0 rounded-full border bg-muted/60 text-muted-foreground shadow-none hover:bg-muted hover:text-foreground"
          onClick={onRandomProblem}
          size="icon"
          type="button"
          variant="outline"
        >
          <Shuffle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
