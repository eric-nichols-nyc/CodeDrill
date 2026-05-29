import {
  isProblemEditorialEmpty,
  parseProblemEditorial,
} from "./parse-editorial";
import {
  asRecord,
  parseProblemTags,
} from "./problem-detail-helpers";
import type {
  ProblemEditorial,
  ProblemRow,
  ProblemSolutionRow,
  ProblemTag,
} from "./problem-detail-types";
import type { WorkspaceData } from "@/features/problem-workspace/components/shell/lib/workspace-data";

export type DirectionsViewModel = {
  p: ProblemRow;
  problem: unknown;
  examples: unknown;
  hints: unknown;
  solutions: ProblemSolutionRow[];
  exampleList: unknown[];
  hintList: unknown[];
  showDescription: boolean;
  showConstraints: boolean;
  showDifficulty: boolean;
  editorial: ProblemEditorial | null;
  tags: ProblemTag[];
};

function pickConstraints(raw: unknown): string | null | undefined {
  if (typeof raw === "string") {
    return raw;
  }
  if (raw === null) {
    return null;
  }
  return;
}

export function problemRow(problem: unknown): ProblemRow {
  const o = asRecord(problem);
  if (!o) {
    return {};
  }
  const editorialParsed = parseProblemEditorial(o.editorial);
  const hasVisualizer =
    o.hasVisualizer === true || o.has_visualizer === true;

  return {
    title: typeof o.title === "string" ? o.title : undefined,
    description: typeof o.description === "string" ? o.description : undefined,
    constraints: pickConstraints(o.constraints),
    difficulty: typeof o.difficulty === "string" ? o.difficulty : undefined,
    editorial: isProblemEditorialEmpty(editorialParsed)
      ? undefined
      : editorialParsed,
    slug: typeof o.slug === "string" ? o.slug : undefined,
    hasVisualizer: hasVisualizer ? true : undefined,
  };
}

export function buildDirectionsViewModel(data: WorkspaceData): DirectionsViewModel {
  const p = problemRow(data.problem);
  const exampleList = Array.isArray(data.examples) ? data.examples : [];
  const hintList = Array.isArray(data.hints) ? data.hints : [];

  return {
    p,
    problem: data.problem,
    examples: data.examples,
    hints: data.hints,
    solutions: data.solutions,
    exampleList,
    hintList,
    showDifficulty: p.difficulty !== undefined && p.difficulty.length > 0,
    showDescription: p.description !== undefined && p.description.length > 0,
    showConstraints:
      p.constraints !== undefined &&
      p.constraints !== null &&
      p.constraints.length > 0,
    editorial: p.editorial ?? null,
    tags: parseProblemTags(data.tags),
  };
}
