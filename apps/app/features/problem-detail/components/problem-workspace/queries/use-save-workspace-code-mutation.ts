"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  saveWorkspaceCode,
  type WorkspaceCodeEntry,
} from "./workspace-code-api";
import { workspaceCodeKeys } from "./workspace-code-keys";

export function useSaveWorkspaceCodeMutation(problemId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { language: string; code: string }) => {
      if (!problemId) {
        throw new Error("problemId is required to save workspace code");
      }
      return saveWorkspaceCode({
        problemId,
        language: input.language,
        code: input.code,
      });
    },
    onSuccess: (entry: WorkspaceCodeEntry) => {
      if (!problemId) {
        return;
      }
      queryClient.setQueryData<WorkspaceCodeEntry[]>(
        workspaceCodeKeys.problem(problemId),
        (prev) => {
          const list = prev ?? [];
          const without = list.filter((row) => row.language !== entry.language);
          return [...without, entry];
        }
      );
    },
  });
}
