import type { ProblemSolutionRow } from "@/features/problem-workspace/directions-panel/lib/problem-detail-types";

/** Server-fetched problem bundle passed into `WorkspaceProvider`. */
export type WorkspaceData = {
  problemId?: string;
  problem: unknown;
  examples: unknown;
  hints: unknown;
  starterCode: unknown;
  testCases?: unknown;
  learningNotes?: unknown;
  solutions: ProblemSolutionRow[];
  tags?: unknown;
};
