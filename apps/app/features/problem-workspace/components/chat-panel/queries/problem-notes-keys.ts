export const problemNotesKeys = {
  all: ["problem-notes"] as const,
  problem: (problemId: string) =>
    [...problemNotesKeys.all, problemId] as const,
};
