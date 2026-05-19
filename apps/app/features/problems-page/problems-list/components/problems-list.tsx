"use client";

import { useMemo } from "react";
import type { Problem, SortDirection, SortField } from "../../lib/types";
import { groupProblemsBySection } from "../utils/group-problems-by-section";
import { ProblemListSection } from "./problem-list-section";
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
  const sections = useMemo(
    () => groupProblemsBySection(problems, sortField, sortDirection),
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
        {sections.map((section) => (
          <ProblemListSection key={section.sectionId} section={section} />
        ))}
      </div>
    </section>
  );
}
