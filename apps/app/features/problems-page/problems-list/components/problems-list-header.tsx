"use client";

import { cn } from "@repo/design-system/lib/utils";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { SortDirection, SortField } from "../../lib/types";
import { problemsListGridClassName } from "../lib/layout";

type ProblemsListHeaderProps = {
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
};

function SortGlyph({
  field,
  sortField,
  sortDirection,
}: {
  field: SortField;
  sortField: SortField;
  sortDirection: SortDirection;
}) {
  if (sortField !== field) {
    return <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />;
  }
  if (sortDirection === "asc") {
    return <ArrowUp className="ml-1 h-4 w-4" />;
  }
  return <ArrowDown className="ml-1 h-4 w-4" />;
}

export function ProblemsListHeader({
  sortField,
  sortDirection,
  onSort,
}: ProblemsListHeaderProps) {
  return (
    <div
      className={cn(
        problemsListGridClassName,
        "border-border border-b bg-muted/30 py-3 font-semibold text-base text-foreground"
      )}
    >
      <span className="justify-self-start text-foreground">Status</span>
      <button
        className="-m-2 flex cursor-pointer select-none items-center justify-self-start rounded-md p-2 text-left text-foreground hover:text-primary"
        onClick={() => onSort("id")}
        type="button"
      >
        <span className="flex items-center whitespace-nowrap">
          #
          <SortGlyph
            field="id"
            sortDirection={sortDirection}
            sortField={sortField}
          />
        </span>
      </button>
      <button
        className="-m-2 flex min-w-0 cursor-pointer select-none items-center rounded-md p-2 text-left text-foreground hover:text-primary"
        onClick={() => onSort("title")}
        type="button"
      >
        <span className="flex min-w-0 items-center">
          Title
          <SortGlyph
            field="title"
            sortDirection={sortDirection}
            sortField={sortField}
          />
        </span>
      </button>
      <span className="justify-self-start text-left text-foreground">
        Solution
      </span>
      <button
        className="-m-2 flex cursor-pointer select-none items-center justify-self-start rounded-md p-2 text-left text-foreground hover:text-primary"
        onClick={() => onSort("difficulty")}
        type="button"
      >
        <span className="flex items-center whitespace-nowrap">
          Difficulty
          <SortGlyph
            field="difficulty"
            sortDirection={sortDirection}
            sortField={sortField}
          />
        </span>
      </button>
    </div>
  );
}
