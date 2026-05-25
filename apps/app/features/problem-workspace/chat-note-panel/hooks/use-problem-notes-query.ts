"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchProblemNotes,
  ProblemNotesApiError,
  type ProblemPersonalNote,
} from "../lib/notes-api";
import { problemNotesKeys } from "../lib/notes-keys";

export function useProblemNotesQuery(
  problemId: string | undefined,
  isSignedIn: boolean
) {
  return useQuery<ProblemPersonalNote, Error>({
    queryKey: problemNotesKeys.problem(problemId ?? ""),
    queryFn: () => fetchProblemNotes(problemId!),
    enabled: Boolean(problemId) && isSignedIn,
    retry: (failureCount, error) => {
      if (
        error instanceof ProblemNotesApiError &&
        error.status === 401
      ) {
        return false;
      }
      return failureCount < 1;
    },
  });
}
