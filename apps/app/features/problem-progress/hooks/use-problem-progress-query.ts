"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProblemProgress } from "../lib/progress-api";
import { problemProgressKeys } from "../lib/progress-keys";
import type { ProblemProgress } from "../lib/types";

export function useProblemProgressQuery(problemId: string | undefined) {
  return useQuery<ProblemProgress, Error>({
    queryKey: problemProgressKeys.problem(problemId ?? ""),
    queryFn: () => fetchProblemProgress(problemId!),
    enabled: Boolean(problemId),
    retry: (failureCount, error) => {
      if (error.message.includes("401")) {
        return false;
      }
      return failureCount < 1;
    },
  });
}
