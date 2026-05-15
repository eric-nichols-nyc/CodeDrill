import { workspaceCodeErrorFromResponse } from "./parse-workspace-code-error";
import { WorkspaceCodeApiError } from "./workspace-code-errors";

export type WorkspaceCodeEntry = {
  language: string;
  code: string;
  updatedAt: string;
};

async function readResponse(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

export async function fetchWorkspaceCode(
  problemId: string
): Promise<WorkspaceCodeEntry[]> {
  let res: Response;
  try {
    res = await fetch(
      `/api/problems/${encodeURIComponent(problemId)}/workspace-code`,
      { cache: "no-store" }
    );
  } catch {
    throw new WorkspaceCodeApiError("Could not reach the server.", {
      status: 0,
      code: "NETWORK",
    });
  }

  const text = await readResponse(res);

  if (!res.ok) {
    throw workspaceCodeErrorFromResponse(res, text);
  }

  if (!text) {
    return [];
  }

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    throw new WorkspaceCodeApiError("Invalid workspace code response.", {
      status: res.status,
      code: "UNKNOWN",
    });
  }

  if (!Array.isArray(body)) {
    return [];
  }

  return body.filter(isWorkspaceCodeEntry);
}

export async function saveWorkspaceCode(input: {
  problemId: string;
  language: string;
  code: string;
}): Promise<WorkspaceCodeEntry> {
  let res: Response;
  try {
    res = await fetch(
      `/api/problems/${encodeURIComponent(input.problemId)}/workspace-code`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: input.language,
          code: input.code,
        }),
      }
    );
  } catch {
    throw new WorkspaceCodeApiError("Could not reach the server.", {
      status: 0,
      code: "NETWORK",
    });
  }

  const text = await readResponse(res);

  if (!res.ok) {
    throw workspaceCodeErrorFromResponse(res, text);
  }

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    throw new WorkspaceCodeApiError("Invalid workspace code response.", {
      status: res.status,
      code: "UNKNOWN",
    });
  }

  if (!isWorkspaceCodeEntry(body)) {
    throw new WorkspaceCodeApiError("Invalid workspace code response.", {
      status: res.status,
      code: "UNKNOWN",
    });
  }

  return body;
}

function isWorkspaceCodeEntry(value: unknown): value is WorkspaceCodeEntry {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const o = value as Record<string, unknown>;
  return (
    typeof o.language === "string" &&
    typeof o.code === "string" &&
    typeof o.updatedAt === "string"
  );
}
