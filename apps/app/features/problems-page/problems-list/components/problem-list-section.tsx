"use client";

import type { ProblemListSectionGroup } from "../utils/group-problems-by-section";
import { ProblemListRow } from "./problem-list-row";

export type ProblemListSectionProps = {
  section: ProblemListSectionGroup;
};

export function ProblemListSection({ section }: ProblemListSectionProps) {
  return (
    <div className="min-w-0">
      <div className="border-border border-b bg-muted/30 px-3 py-2.5 font-semibold text-base text-foreground">
        {section.label}
      </div>
      <div className="divide-y divide-border">
        {section.problems.map((problem, stripeIndex) => (
          <ProblemListRow
            key={problem.slug}
            problem={problem}
            stripeIndex={stripeIndex}
          />
        ))}
      </div>
    </div>
  );
}
