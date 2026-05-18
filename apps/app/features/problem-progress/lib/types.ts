/** Matches Nest `ProblemProgressView` / `GET|PATCH .../progress`. */
export type ProblemProgress = {
  status: "not_started" | "attempted" | "solved";
  isFavorite: boolean;
  updatedAt: string;
};

export type PatchProblemProgressInput = {
  problemId: string;
  isFavorite?: boolean;
  status?: ProblemProgress["status"];
};
