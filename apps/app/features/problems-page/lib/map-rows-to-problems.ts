import type { Difficulty, Problem } from "./types";

function normalizeDifficulty(raw?: string): Difficulty {
  const x = (raw ?? "").toLowerCase();
  if (x === "easy") {
    return "Easy";
  }
  if (x === "hard") {
    return "Hard";
  }
  if (x === "medium") {
    return "Medium";
  }
  return "Medium";
}

const HASH_MOD = 2_147_483_647;

/** Deterministic pseudo-acceptance for rows that do not include it from the API. */
function stableAcceptance(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) % HASH_MOD;
  }
  return Math.round((35 + (h % 4500) / 100) * 10) / 10;
}

export type ApiProblemRow = {
  id?: string;
  slug: string;
  title: string;
  difficulty?: string;
};

export function mapRowsToProblems(rows: ApiProblemRow[]): Problem[] {
  return rows.map((row, i) => ({
    id: i + 1,
    problemId: row.id,
    slug: row.slug,
    title: row.title,
    difficulty: normalizeDifficulty(row.difficulty),
    acceptance: stableAcceptance(row.slug),
    status: "unsolved",
    tags: [],
    isPremium: false,
  }));
}
