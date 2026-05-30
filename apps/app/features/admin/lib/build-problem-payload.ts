import type { CreateProblemBody } from "./create-problem-schema";

function trim(s: string): string {
  return s.trim();
}

/** JSON body for `POST /problems` (optional fields omitted when empty). */
export function buildProblemPayload(
  values: CreateProblemBody
): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    title: trim(values.title),
    slug: trim(values.slug),
    difficulty: values.difficulty,
    description: trim(values.description),
    isPublished: values.isPublished,
    starterCode: values.starterCode.map((row) => ({
      language: trim(row.language),
      code: row.code,
      ...(trim(row.functionName ?? "")
        ? { functionName: trim(row.functionName ?? "") }
        : {}),
    })),
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

  const editorial = values.editorial;
  if (editorial) {
    const title = trim(editorial.title ?? "");
    const content = editorial.content ?? "";
    const embeds = editorial.embeds
      .filter((e) => e.type === "youtube" && trim(e.videoId))
      .map((e) => ({ type: "youtube" as const, videoId: trim(e.videoId) }));
    if (title || content.trim() || embeds.length > 0) {
      payload.editorial = {
        content,
        embeds,
        ...(title ? { title } : {}),
      };
    }
  }

  const tags = values.tags?.map(trim).filter(Boolean);
  if (tags && tags.length > 0) {
    payload.tags = tags;
  }

  const examples = values.examples
    ?.map((row) => ({
      input: trim(row.input),
      output: trim(row.output),
      ...(trim(row.explanation ?? "")
        ? { explanation: trim(row.explanation ?? "") }
        : {}),
      ...(trim(row.imageUrl ?? "") ? { imageUrl: trim(row.imageUrl ?? "") } : {}),
      ...(trim(row.imageAlt ?? "") ? { imageAlt: trim(row.imageAlt ?? "") } : {}),
      ...(row.sortOrder !== undefined ? { sortOrder: row.sortOrder } : {}),
    }))
    .filter((row) => row.input && row.output);
  if (examples && examples.length > 0) {
    payload.examples = examples;
  }

  const hints = values.hints
    ?.map((row) => ({
      ...(trim(row.title ?? "") ? { title: trim(row.title ?? "") } : {}),
      body: trim(row.body),
      ...(row.sortOrder !== undefined ? { sortOrder: row.sortOrder } : {}),
    }))
    .filter((row) => row.body);
  if (hints && hints.length > 0) {
    payload.hints = hints;
  }

  const solutions = values.solutions
    ?.map((row) => ({
      language: trim(row.language),
      code: row.code,
      ...(trim(row.explanation ?? "")
        ? { explanation: trim(row.explanation ?? "") }
        : {}),
      ...(trim(row.timeComplexity ?? "")
        ? { timeComplexity: trim(row.timeComplexity ?? "") }
        : {}),
      ...(trim(row.spaceComplexity ?? "")
        ? { spaceComplexity: trim(row.spaceComplexity ?? "") }
        : {}),
    }))
    .filter((row) => row.language && row.code);
  if (solutions && solutions.length > 0) {
    payload.solutions = solutions;
  }

  const testCases = values.testCases
    ?.map((row) => ({
      input: trim(row.input),
      expectedOutput: trim(row.expectedOutput),
      ...(row.isSample !== undefined ? { isSample: row.isSample } : {}),
      ...(row.sortOrder !== undefined ? { sortOrder: row.sortOrder } : {}),
    }))
    .filter((row) => row.input && row.expectedOutput);
  if (testCases && testCases.length > 0) {
    payload.testCases = testCases;
  }

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
