import type { CreateProblemBody } from "@/lib/admin/create-problem-schema";

function trim(s: string): string {
  return s.trim();
}

/** JSON body for `POST /problems` (optional fields omitted when empty). */
export function buildProblemPayload(values: CreateProblemBody): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    title: trim(values.title),
    slug: trim(values.slug),
    difficulty: values.difficulty,
    description: trim(values.description),
    isPublished: values.isPublished,
  };

  const addIfNonEmpty = (key: string, value: string | undefined) => {
    const t = trim(value ?? "");
    if (t) {
      payload[key] = t;
    }
  };

  addIfNonEmpty("constraints", values.constraints);
  addIfNonEmpty("patternSlug", values.patternSlug);
  addIfNonEmpty("loopStructure", values.loopStructure);
  addIfNonEmpty("skillFocus", values.skillFocus);
  addIfNonEmpty("tutorLevel", values.tutorLevel);
  addIfNonEmpty("visualizationNotes", values.visualizationNotes);
  addIfNonEmpty("editorial", values.editorial);

  return payload;
}

export function formatSubmitError(body: unknown, status: number): string {
  if (typeof body === "object" && body !== null && "message" in body) {
    return String((body as { message: unknown }).message);
  }
  if (typeof body === "string") {
    return body;
  }
  return `Request failed (${status})`;
}
