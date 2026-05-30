import { problemNotesErrorFromResponse } from "./parse-problem-notes-error";
import { ProblemNotesApiError } from "./problem-notes-errors";

export type ProblemPersonalNote = {
  body: string;
  updatedAt: string | null;
};

async function readResponse(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

function isProblemPersonalNote(value: unknown): value is ProblemPersonalNote {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const o = value as Record<string, unknown>;
  return (
    typeof o.body === "string" &&
    (o.updatedAt === null || typeof o.updatedAt === "string")
  );
}

export async function fetchProblemNotes(
  problemId: string
): Promise<ProblemPersonalNote> {
  let res: Response;
  try {
    res = await fetch(
      `/api/problems/${encodeURIComponent(problemId)}/notes`,
      { cache: "no-store" }
    );
  } catch {
    throw new ProblemNotesApiError("Could not reach the server.", {
      status: 0,
      code: "NETWORK",
    });
  }

  const text = await readResponse(res);

  if (!res.ok) {
    throw problemNotesErrorFromResponse(res, text);
  }

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    throw new ProblemNotesApiError("Invalid notes response.", {
      status: res.status,
      code: "UNKNOWN",
    });
  }

  if (!isProblemPersonalNote(body)) {
    throw new ProblemNotesApiError("Invalid notes response.", {
      status: res.status,
      code: "UNKNOWN",
    });
  }

  return body;
}

export async function saveProblemNotes(input: {
  problemId: string;
  body: string;
}): Promise<ProblemPersonalNote> {
  let res: Response;
  try {
    res = await fetch(
      `/api/problems/${encodeURIComponent(input.problemId)}/notes`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: input.body }),
      }
    );
  } catch {
    throw new ProblemNotesApiError("Could not reach the server.", {
      status: 0,
      code: "NETWORK",
    });
  }

  const text = await readResponse(res);

  if (!res.ok) {
    throw problemNotesErrorFromResponse(res, text);
  }

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    throw new ProblemNotesApiError("Invalid notes response.", {
      status: res.status,
      code: "UNKNOWN",
    });
  }

  if (!isProblemPersonalNote(body)) {
    throw new ProblemNotesApiError("Invalid notes response.", {
      status: res.status,
      code: "UNKNOWN",
    });
  }

  return body;
}
