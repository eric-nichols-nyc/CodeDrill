"use client";

import { useMemo } from "react";
import type { Problem, SortDirection, SortField } from "../../lib/types";
import { sortProblems } from "../utils/sort-problems";
import { ProblemListRow } from "./problem-list-row";
import { ProblemsListHeader } from "./problems-list-header";

export type ProblemsListProps = {
  problems: Problem[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
};

export function ProblemsList({
  problems,
  sortField,
  sortDirection,
  onSort,
}: ProblemsListProps) {
  const sorted = useMemo(
    () => sortProblems(problems, sortField, sortDirection),
    [problems, sortField, sortDirection]
  );

  return (
    <section aria-label="Problems" className="min-w-0">
      <ProblemsListHeader
        onSort={onSort}
        sortDirection={sortDirection}
        sortField={sortField}
      />
      <div className="divide-y divide-border">
        {sorted.map((problem, stripeIndex) => (
          <ProblemListRow
            key={problem.slug}
            problem={problem}
            stripeIndex={stripeIndex}
          />
        ))}
      </div>
    </section>
  );
}
