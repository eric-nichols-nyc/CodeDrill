import type { CreateProblemBody } from "./create-problem-schema";
import { createProblemBodySchema } from "./create-problem-schema";
import { normalizeCreateProblemBody } from "./problem-form-values";

export type RequestGenerateProblemResult =
  | { ok: true; body: CreateProblemBody }
  | { ok: false; error: string };

function formatIssues(issues: unknown): string {
  if (typeof issues === "object" && issues !== null && "fieldErrors" in issues) {
    const fe = (issues as { fieldErrors?: Record<string, unknown> }).fieldErrors;
    if (fe && typeof fe === "object") {
      return Object.entries(fe)
        .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
        .join("; ");
    }
  }
  return JSON.stringify(issues);
}

export async function requestGeneratedProblem(
  prompt: string
): Promise<RequestGenerateProblemResult> {
  const res = await fetch("/api/admin/problems/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ prompt }),
  });

  const text = await res.text();
  let json: unknown;
  try {
    json = JSON.parse(text) as unknown;
  } catch {
    return { ok: false, error: text.slice(0, 400) || "Invalid response" };
  }

  const rec =
    typeof json === "object" && json !== null ? (json as Record<string, unknown>) : null;

  if (!res.ok) {
    const err = typeof rec?.error === "string" ? rec.error : `Request failed (${res.status})`;
    const issues = rec?.issues;
    return {
      ok: false,
      error: issues ? `${err} — ${formatIssues(issues)}` : err,
    };
  }

  const parsed = createProblemBodySchema.safeParse(rec?.problem);
  if (!parsed.success) {
    return {
      ok: false,
      error: `Client validation failed: ${formatIssues(parsed.error.flatten())}`,
    };
  }

  return { ok: true, body: normalizeCreateProblemBody(parsed.data) };
}
