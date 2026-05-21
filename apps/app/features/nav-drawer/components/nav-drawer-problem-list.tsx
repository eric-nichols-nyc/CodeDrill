"use client";

import { useMemo } from "react";
import type { Problem } from "@/features/problems-page/lib/types";
import { NavDrawerProblemRow } from "./nav-drawer-problem-row";

export type NavDrawerProblemListProps = {
  problems: Problem[];
  currentSlug: string;
  fetchOk: boolean;
  fetchStatus: number;
};

export function NavDrawerProblemList({
  problems,
  currentSlug,
  fetchOk,
  fetchStatus,
}: NavDrawerProblemListProps) {
  const sorted = useMemo(
    () => [...problems].sort((a, b) => a.id - b.id),
    [problems]
  );

  if (!fetchOk) {
    return (
      <p className="px-4 py-6 text-muted-foreground text-sm">
        Could not load problems (HTTP {fetchStatus}).
      </p>
    );
  }

  if (sorted.length === 0) {
    return (
      <p className="px-4 py-6 text-muted-foreground text-sm">
        No problems loaded.
      </p>
    );
  }

  return (
    <nav aria-label="Problem catalog" className="min-h-0 flex-1 overflow-y-auto">
      {sorted.map((problem) => (
        <NavDrawerProblemRow
          isActive={problem.slug === currentSlug}
          key={problem.slug}
          problem={problem}
        />
      ))}
    </nav>
  );
}
