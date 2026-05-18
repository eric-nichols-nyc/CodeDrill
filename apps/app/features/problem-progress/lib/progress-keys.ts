export const problemProgressKeys = {
  all: ["problem-progress"] as const,
  problem: (problemId: string) =>
    [...problemProgressKeys.all, problemId] as const,
};
