import type { Difficulty, Problem, Status } from "./types";

export type ProblemListFilterState = {
  search: string;
  difficulty: Difficulty | "all";
  status: Status | "all";
  selectedTags: string[];
};

export function problemMatchesFilters(
  problem: Problem,
  filters: ProblemListFilterState
): boolean {
  const { search, difficulty, status, selectedTags } = filters;
  if (search && !problem.title.toLowerCase().includes(search.toLowerCase())) {
    return false;
  }
  if (difficulty !== "all" && problem.difficulty !== difficulty) {
    return false;
  }
  if (status !== "all" && problem.status !== status) {
    return false;
  }
  if (
    selectedTags.length > 0 &&
    !selectedTags.some((tag) => problem.tags.includes(tag))
  ) {
    return false;
  }
  return true;
}
