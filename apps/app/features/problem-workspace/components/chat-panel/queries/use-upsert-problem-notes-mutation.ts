"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  saveProblemNotes,
  type ProblemPersonalNote,
} from "./problem-notes-api";
import { problemNotesKeys } from "./problem-notes-keys";

export function useUpsertProblemNotesMutation(problemId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: string) => {
      if (!problemId) {
        throw new Error("problemId is required to save notes");
      }
      return saveProblemNotes({ problemId, body });
    },
    onSuccess: (note: ProblemPersonalNote) => {
      if (!problemId) {
        return;
      }
      queryClient.setQueryData(problemNotesKeys.problem(problemId), note);
    },
  });
}
