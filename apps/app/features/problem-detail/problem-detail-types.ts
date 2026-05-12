export type ProblemRow = {
  title?: string;
  description?: string;
  constraints?: string | null;
  difficulty?: string;
  editorial?: string | null;
};

/** Serialized `problem_solutions` row from the problems API (Drizzle / Nest JSON). */
export type ProblemSolutionRow = {
  id: string;
  problemId: string;
  language: string;
  code: string;
  explanation: string | null;
  timeComplexity: string | null;
  spaceComplexity: string | null;
  createdAt: string;
};
