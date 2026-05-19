import type { ApiProblemRow, ApiProblemTag } from "./map-rows-to-problems";

function parseApiProblemTags(raw: unknown): ApiProblemTag[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw.flatMap((item) => {
    if (typeof item !== "object" || item === null) {
      return [];
    }
    const o = item as Record<string, unknown>;
    const name = typeof o.name === "string" ? o.name.trim() : "";
    if (!name) {
      return [];
    }
    const slug =
      typeof o.slug === "string" && o.slug.length > 0 ? o.slug : name;
    return [{ name, slug }];
  });
}

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
        tags: parseApiProblemTags(o.tags),
        patternSlug: parsePatternSlug(o),
      },
    ];
  });
}

function parsePatternSlug(o: Record<string, unknown>): string | undefined {
  if (typeof o.patternSlug === "string") {
    const trimmed = o.patternSlug.trim();
    if (trimmed) {
      return trimmed;
    }
  }
  if (typeof o.pattern_slug === "string") {
    const trimmed = o.pattern_slug.trim();
    if (trimmed) {
      return trimmed;
    }
  }
}
