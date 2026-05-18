"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchProblemProgress } from "../lib/progress-api";
import { problemProgressKeys } from "../lib/progress-keys";
import type { PatchProblemProgressInput, ProblemProgress } from "../lib/types";

export function usePatchProblemProgressMutation(problemId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation<ProblemProgress, Error, Omit<PatchProblemProgressInput, "problemId">>({
    mutationFn: (patch) =>
      patchProblemProgress({ problemId: problemId!, ...patch }),
    onSuccess: (data) => {
      if (problemId) {
        queryClient.setQueryData(problemProgressKeys.problem(problemId), data);
      }
    },
  });
}
