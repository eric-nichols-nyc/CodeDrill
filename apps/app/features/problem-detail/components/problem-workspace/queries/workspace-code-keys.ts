export const workspaceCodeKeys = {
  all: ["workspace-code"] as const,
  problem: (problemId: string) =>
    [...workspaceCodeKeys.all, problemId] as const,
};
