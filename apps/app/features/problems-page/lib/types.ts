export type Difficulty = "Easy" | "Medium" | "Hard";

export type Status = "solved" | "attempted" | "unsolved";

export type Problem = {
  id: number;
  /** Postgres UUID from the catalog API; required for progress/favorite. */
  problemId?: string;
  slug: string;
  title: string;
  acceptance: number;
  difficulty: Difficulty;
  status: Status;
  tags: string[];
  /** Study-plan section key from API `patternSlug` (e.g. two-pointers, sliding-window). */
  patternSlug?: string;
  isPremium: boolean;
};

export type SortField = "id" | "title" | "acceptance" | "difficulty";

export type SortDirection = "asc" | "desc";
