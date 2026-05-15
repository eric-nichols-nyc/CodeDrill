"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchWorkspaceCode,
  type WorkspaceCodeEntry,
} from "./workspace-code-api";
import { workspaceCodeKeys } from "./workspace-code-keys";
import { isWorkspaceCodeApiError } from "./workspace-code-errors";

export function useWorkspaceCodeQuery(problemId: string | undefined) {
  return useQuery<WorkspaceCodeEntry[], Error>({
    queryKey: workspaceCodeKeys.problem(problemId ?? ""),
    queryFn: () => fetchWorkspaceCode(problemId!),
    enabled: Boolean(problemId),
    retry: (failureCount, error) => {
      if (isWorkspaceCodeApiError(error) && error.status === 401) {
        return false;
      }
      return failureCount < 1;
    },
  });
}
