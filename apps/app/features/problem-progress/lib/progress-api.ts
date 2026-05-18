import type { PatchProblemProgressInput, ProblemProgress } from "./types";

async function readResponse(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

function progressPath(problemId: string): string {
  return `/api/problems/${encodeURIComponent(problemId)}/progress`;
}

function isProblemProgress(value: unknown): value is ProblemProgress {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const o = value as Record<string, unknown>;
  return (
    (o.status === "not_started" ||
      o.status === "attempted" ||
      o.status === "solved") &&
    typeof o.isFavorite === "boolean" &&
    typeof o.updatedAt === "string"
  );
}

export async function fetchProblemProgress(
  problemId: string
): Promise<ProblemProgress> {
  const res = await fetch(progressPath(problemId), { cache: "no-store" });
  const text = await readResponse(res);

  if (!res.ok) {
    throw new Error(text || `Failed to load progress (${res.status})`);
  }

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    throw new Error("Invalid progress response.");
  }

  if (!isProblemProgress(body)) {
    throw new Error("Invalid progress response.");
  }

  return body;
}

export async function patchProblemProgress(
  input: PatchProblemProgressInput
): Promise<ProblemProgress> {
  const { problemId, ...patch } = input;
  const res = await fetch(progressPath(problemId), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  const text = await readResponse(res);

  if (!res.ok) {
    throw new Error(text || `Failed to save progress (${res.status})`);
  }

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    throw new Error("Invalid progress response.");
  }

  if (!isProblemProgress(body)) {
    throw new Error("Invalid progress response.");
  }

  return body;
}
