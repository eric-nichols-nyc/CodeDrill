export type EditorialYoutubeEmbed = { type: "youtube"; videoId: string };

export type ProblemEditorial = {
  title?: string;
  content: string;
  embeds: EditorialYoutubeEmbed[];
};

export type ProblemTag = {
  id: string;
  name: string;
  slug: string;
};

export type ProblemRow = {
  title?: string;
  description?: string;
  constraints?: string | null;
  difficulty?: string;
  editorial?: ProblemEditorial;
};

/** Serialized `problem_solutions` row from the problems API (Drizzle / Nest JSON). */
export type ProblemSolutionRow = {
  id: string;
  problemId: string;
  language: string;
  code: string;
  explanation: string | null;
  timeComplexity: string | null;
  spaceComplexity: string | null;
  createdAt: string;
};
