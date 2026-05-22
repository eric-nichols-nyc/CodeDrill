import { NextResponse } from "next/server";
import { createProblemBodySchema } from "@/features/admin/lib/create-problem-schema";
import { keys } from "@/lib/auth/keys";
import { getApiAuth } from "@/lib/auth/server";
import {
  parseModelJsonObject,
  readOpenAiAssistantContent,
  readOpenAiErrorMessage,
} from "./openai-completion";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

const SYSTEM_PROMPT = `You help authors create coding problems for an app called Codedrill.
The user will describe what they want in plain English (problem idea, difficulty, languages, reference solution code, test ideas, etc.).

Respond with a single JSON object (no markdown fences, no commentary) matching this shape for a "create problem" form:

Required keys:
- "title": string, non-empty
- "slug": string, kebab-case, unique-ish (no spaces)
- "difficulty": exactly one of "easy" | "medium" | "hard"
- "description": full problem statement (non-empty string)
- "starterCode": array of at least one object: { "language": "javascript" | "typescript" | "python" (or other short id), "code": string (stub with correct function signature), "functionName": string — MUST match how the runner invokes the function (camelCase for JS/TS, snake_case for python) }

Highly recommended:
- "constraints": string
- "examples": array of { "input": string, "output": string, "explanation"?: string } — input/output can be LeetCode-style (e.g. nums = [1,2]) for readability
- "testCases": array of { "input": string, "expectedOutput": string, "isSample"?: boolean }
  CRITICAL for testCases: "input" is a JSON STRING of the **argument list** passed to the user's function.
  Example: one array argument nums → input is the string [[1,2,3]] (outer JSON array = call args; inner array is nums).
  "expectedOutput" is a JSON STRING of the return value, e.g. "4" for number 4, "[1,2]" for an array, "\\"hello\\"" for a string.
- "solutions": optional array of { "language", "code", "explanation"?, "timeComplexity"?, "spaceComplexity"? } — if the user pasted reference code, put it here (language must match, e.g. javascript)
- "hints": optional array of { "title"?, "body" } with helpful bodies
- "tags": optional string array
- "isPublished": boolean, default false for drafts

Optional metadata strings (empty string if unknown): "patternSlug", "loopStructure", "skillFocus", "tutorLevel", "visualizationNotes"

Omit "editorial" unless you have real HTML walkthrough content; if omitted, the form uses defaults.

Ensure: every starterCode row has a unique "language"; JS/TS functionName matches the function name in the starter "code" string; test case inputs are valid JSON strings that parse to an array of arguments; expectedOutput strings parse as JSON and match what the reference solution returns.`;

function parseRequestPrompt(body: unknown): string | null {
  const record =
    typeof body === "object" && body !== null ? (body as Record<string, unknown>) : null;
  const prompt = typeof record?.prompt === "string" ? record.prompt.trim() : "";
  return prompt.length > 0 ? prompt : null;
}

export async function POST(request: Request) {
  const { session } = await getApiAuth();
  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const apiKey = keys().OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not set on the server." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const prompt = parseRequestPrompt(body);
  if (!prompt) {
    return NextResponse.json({ error: "Missing non-empty \"prompt\" string." }, { status: 400 });
  }

  const upstream = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.25,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `${prompt}\n\nReturn only one JSON object for the problem form as specified.`,
        },
      ],
    }),
  });

  const rawText = await upstream.text();
  let completion: unknown;
  try {
    completion = JSON.parse(rawText) as unknown;
  } catch {
    return NextResponse.json(
      { error: "OpenAI returned non-JSON.", detail: rawText.slice(0, 500) },
      { status: 502 }
    );
  }

  if (!upstream.ok) {
    return NextResponse.json(
      { error: readOpenAiErrorMessage(completion, upstream.status) },
      { status: 502 }
    );
  }

  const content = readOpenAiAssistantContent(completion);
  if (!content?.trim()) {
    return NextResponse.json(
      { error: "OpenAI returned an empty message." },
      { status: 502 }
    );
  }

  let parsedJson: unknown;
  try {
    parsedJson = parseModelJsonObject(content);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid JSON from model";
    return NextResponse.json(
      { error: "Could not parse model output as JSON.", detail: msg },
      { status: 502 }
    );
  }

  const validated = createProblemBodySchema.safeParse(parsedJson);
  if (!validated.success) {
    return NextResponse.json(
      {
        error: "Model JSON failed validation.",
        issues: validated.error.flatten(),
      },
      { status: 422 }
    );
  }

  return NextResponse.json({ problem: validated.data });
}
