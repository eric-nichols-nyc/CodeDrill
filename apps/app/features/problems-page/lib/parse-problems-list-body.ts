import type { ApiProblemRow } from "./map-rows-to-problems";

export function parseProblemsListBody(body: unknown): ApiProblemRow[] {
  if (!Array.isArray(body)) {
    return [];
  }
  return body.flatMap((item) => {
    if (typeof item !== "object" || item === null) {
      return [];
    }
    const o = item as Record<string, unknown>;
    if (typeof o.slug !== "string" || typeof o.title !== "string") {
      return [];
    }
    return [
      {
        id: typeof o.id === "string" ? o.id : undefined,
        slug: o.slug,
        title: o.title,
        difficulty: typeof o.difficulty === "string" ? o.difficulty : undefined,
      },
    ];
  });
}
