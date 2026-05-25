import { publicApiBaseUrl } from "@/lib/auth/public-api-url";
import { readAuthTokenFromStorage } from "@/lib/auth/token";

export type ProblemPersonalNote = {
  body: string;
  updatedAt: string | null;
};

export class ProblemNotesApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(
    message: string,
    options: { status: number; code: string }
  ) {
    super(message);
    this.name = "ProblemNotesApiError";
    this.status = options.status;
    this.code = options.code;
  }
}

function notesPath(problemId: string): string {
  return `${publicApiBaseUrl()}/problems/${encodeURIComponent(problemId)}/notes`;
}

async function readResponse(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

function authHeaders(): Record<string, string> {
  const token = readAuthTokenFromStorage();
  if (!token) {
    throw new ProblemNotesApiError("Sign in to save notes across sessions.", {
      status: 401,
      code: "NOT_SIGNED_IN",
    });
  }
  return { Authorization: `Bearer ${token}` };
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

function errorFromResponse(res: Response, text: string): ProblemNotesApiError {
  if (res.status === 401) {
    return new ProblemNotesApiError(
      text || "Sign in to save notes across sessions.",
      { status: 401, code: "NOT_SIGNED_IN" }
    );
  }
  return new ProblemNotesApiError(text || `Request failed (${res.status})`, {
    status: res.status,
    code: "UNKNOWN",
  });
}

export async function fetchProblemNotes(
  problemId: string
): Promise<ProblemPersonalNote> {
  let res: Response;
  try {
    res = await fetch(notesPath(problemId), {
      headers: authHeaders(),
      cache: "no-store",
    });
  } catch {
    throw new ProblemNotesApiError("Could not reach the server.", {
      status: 0,
      code: "NETWORK",
    });
  }

  const text = await readResponse(res);

  if (!res.ok) {
    throw errorFromResponse(res, text);
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
    res = await fetch(notesPath(input.problemId), {
      method: "PUT",
      headers: {
        ...authHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ body: input.body }),
    });
  } catch {
    throw new ProblemNotesApiError("Could not reach the server.", {
      status: 0,
      code: "NETWORK",
    });
  }

  const text = await readResponse(res);

  if (!res.ok) {
    throw errorFromResponse(res, text);
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
