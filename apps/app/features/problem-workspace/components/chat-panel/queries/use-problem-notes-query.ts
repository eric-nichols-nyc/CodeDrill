"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchProblemNotes,
  type ProblemPersonalNote,
} from "./problem-notes-api";
import { isProblemNotesApiError } from "./problem-notes-errors";
import { problemNotesKeys } from "./problem-notes-keys";

export function useProblemNotesQuery(
  problemId: string | undefined,
  isSignedIn: boolean
) {
  return useQuery<ProblemPersonalNote, Error>({
    queryKey: problemNotesKeys.problem(problemId ?? ""),
    queryFn: () => fetchProblemNotes(problemId!),
    enabled: Boolean(problemId) && isSignedIn,
    retry: (failureCount, error) => {
      if (isProblemNotesApiError(error) && error.status === 401) {
        return false;
      }
      return failureCount < 1;
    },
  });
}
