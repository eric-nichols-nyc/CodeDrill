export type Difficulty = "Easy" | "Medium" | "Hard";

export type Status = "solved" | "attempted" | "unsolved";

export type Problem = {
  id: number;
  slug: string;
  title: string;
  acceptance: number;
  difficulty: Difficulty;
  status: Status;
  tags: string[];
  isPremium: boolean;
};

export type SortField = "id" | "title" | "acceptance" | "difficulty";

export type SortDirection = "asc" | "desc";
