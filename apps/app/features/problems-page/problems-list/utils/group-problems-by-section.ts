import type { Problem, SortDirection, SortField } from "../../lib/types";
import {
  PROBLEM_LIST_SECTIONS,
  problemListSectionLabel,
  resolveProblemListSectionId,
  UNCATEGORIZED_SECTION_ID,
} from "../lib/problem-list-sections";
import { sortProblems } from "./sort-problems";

export type ProblemListSectionGroup = {
  sectionId: string;
  label: string;
  problems: Problem[];
};

export function groupProblemsBySection(
  problems: Problem[],
  sortField: SortField,
  sortDirection: SortDirection
): ProblemListSectionGroup[] {
  const buckets = new Map<string, Problem[]>();

  for (const problem of problems) {
    const sectionId = resolveProblemListSectionId(problem.patternSlug);
    const list = buckets.get(sectionId) ?? [];
    list.push(problem);
    buckets.set(sectionId, list);
  }

  const groups: ProblemListSectionGroup[] = [];

  for (const section of PROBLEM_LIST_SECTIONS) {
    const bucket = buckets.get(section.id);
    if (!bucket?.length) {
      continue;
    }
    groups.push({
      sectionId: section.id,
      label: section.label,
      problems: sortProblems(bucket, sortField, sortDirection),
    });
    buckets.delete(section.id);
  }

  const uncategorized = buckets.get(UNCATEGORIZED_SECTION_ID);
  if (uncategorized?.length) {
    groups.push({
      sectionId: UNCATEGORIZED_SECTION_ID,
      label: problemListSectionLabel(UNCATEGORIZED_SECTION_ID),
      problems: sortProblems(uncategorized, sortField, sortDirection),
    });
    buckets.delete(UNCATEGORIZED_SECTION_ID);
  }

  for (const [sectionId, bucket] of buckets) {
    if (!bucket.length) {
      continue;
    }
    groups.push({
      sectionId,
      label: problemListSectionLabel(sectionId),
      problems: sortProblems(bucket, sortField, sortDirection),
    });
  }

  return groups;
}
