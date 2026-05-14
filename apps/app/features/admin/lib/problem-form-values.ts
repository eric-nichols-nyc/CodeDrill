import type { CreateProblemBody } from "./create-problem-schema";
import { parseProblemEditorial } from "@/features/problem-detail/parse-editorial";

type ProblemRecord = Record<string, unknown>;

function asRecord(value: unknown): ProblemRecord | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }
  return value as ProblemRecord;
}

function stringField(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function booleanField(value: unknown): boolean {
  return value === true;
}

export type AdminProblemListItem = {
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  isPublished: boolean;
};

export function parseAdminProblemListItem(
  value: unknown
): AdminProblemListItem | null {
  const row = asRecord(value);
  if (
    !row ||
    typeof row.id !== "string" ||
    typeof row.title !== "string" ||
    typeof row.slug !== "string" ||
    typeof row.difficulty !== "string"
  ) {
    return null;
  }
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    difficulty: row.difficulty,
    isPublished: row.isPublished === true,
  };
}

export type AdminProblemDetail = {
  problem: unknown;
  tags?: unknown;
  examples?: unknown;
  hints?: unknown;
  starterCode?: unknown;
  solutions?: unknown;
  testCases?: unknown;
};

export function normalizeCreateProblemBody(
  value?: Partial<CreateProblemBody> | null
): CreateProblemBody {
  return {
    title: value?.title ?? "",
    slug: value?.slug ?? "",
    difficulty: value?.difficulty ?? "easy",
    description: value?.description ?? "",
    constraints: value?.constraints ?? "",
    isPublished: value?.isPublished ?? false,
    patternSlug: value?.patternSlug ?? "",
    loopStructure: value?.loopStructure ?? "",
    skillFocus: value?.skillFocus ?? "",
    tutorLevel: value?.tutorLevel ?? "",
    visualizationNotes: value?.visualizationNotes ?? "",
    editorial: parseProblemEditorial(value?.editorial),
    tags: value?.tags ?? [],
    examples: value?.examples ?? [],
    starterCode:
      value?.starterCode && value.starterCode.length > 0
        ? value.starterCode
        : [
            {
              language: "javascript",
              code: "",
              functionName: "",
            },
          ],
    hints: value?.hints ?? [],
    solutions: value?.solutions ?? [],
    testCases: value?.testCases ?? [],
  };
}

export function detailToFormValues(
  detail: AdminProblemDetail
): CreateProblemBody {
  const problem = asRecord(detail.problem);
  const tags = Array.isArray(detail.tags) ? detail.tags : [];
  const examples = Array.isArray(detail.examples) ? detail.examples : [];
  const hints = Array.isArray(detail.hints) ? detail.hints : [];
  const starterCode = Array.isArray(detail.starterCode)
    ? detail.starterCode
    : [];
  const solutions = Array.isArray(detail.solutions) ? detail.solutions : [];
  const testCases = Array.isArray(detail.testCases) ? detail.testCases : [];

  return normalizeCreateProblemBody({
    title: stringField(problem?.title),
    slug: stringField(problem?.slug),
    difficulty:
      problem?.difficulty === "medium" || problem?.difficulty === "hard"
        ? problem.difficulty
        : "easy",
    description: stringField(problem?.description),
    constraints: stringField(problem?.constraints),
    isPublished: booleanField(problem?.isPublished),
    patternSlug: stringField(problem?.patternSlug),
    loopStructure: stringField(problem?.loopStructure),
    skillFocus: stringField(problem?.skillFocus),
    tutorLevel: stringField(problem?.tutorLevel),
    visualizationNotes: stringField(problem?.visualizationNotes),
    editorial: parseProblemEditorial(problem?.editorial),
    tags: tags
      .map((tag) => asRecord(tag))
      .filter(Boolean)
      .map((tag) => stringField(tag?.name))
      .filter(Boolean),
    examples: examples.map((example) => {
      const row = asRecord(example);
      return {
        input: stringField(row?.input),
        output: stringField(row?.output),
        explanation: stringField(row?.explanation),
      };
    }),
    starterCode: starterCode.map((entry) => {
      const row = asRecord(entry);
      return {
        language: stringField(row?.language) || "javascript",
        code: stringField(row?.code),
        functionName: stringField(row?.functionName),
      };
    }),
    hints: hints.map((hint) => {
      const row = asRecord(hint);
      return {
        title: stringField(row?.title),
        body: stringField(row?.body),
      };
    }),
    solutions: solutions.map((solution) => {
      const row = asRecord(solution);
      return {
        language: stringField(row?.language) || "javascript",
        code: stringField(row?.code),
        explanation: stringField(row?.explanation),
        timeComplexity: stringField(row?.timeComplexity),
        spaceComplexity: stringField(row?.spaceComplexity),
      };
    }),
    testCases: testCases.map((testCase) => {
      const row = asRecord(testCase);
      return {
        input: stringField(row?.input),
        expectedOutput: stringField(row?.expectedOutput),
        isSample: booleanField(row?.isSample),
      };
    }),
  });
}
