import { SplitLayout } from "@/components/split-layout";
import { ProblemDetailLeftPane } from "@/features/problem-detail/components/problem-detail-left-pane";
import { ProblemWorkspace } from "@/features/problem-detail/components/problem-workspace/problem-workspace";
import {
  isProblemEditorialEmpty,
  parseProblemEditorial,
} from "@/features/problem-detail/parse-editorial";
import { asRecord } from "@/features/problem-detail/problem-detail-helpers";
import type {
  ProblemRow,
  ProblemSolutionRow,
} from "@/features/problem-detail/problem-detail-types";

function pickConstraints(raw: unknown): string | null | undefined {
  if (typeof raw === "string") {
    return raw;
  }
  if (raw === null) {
    return null;
  }
  return;
}

function problemRow(problem: unknown): ProblemRow {
  const o = asRecord(problem);
  if (!o) {
    return {};
  }
  const editorialParsed = parseProblemEditorial(o.editorial);
  return {
    title: typeof o.title === "string" ? o.title : undefined,
    description: typeof o.description === "string" ? o.description : undefined,
    constraints: pickConstraints(o.constraints),
    difficulty: typeof o.difficulty === "string" ? o.difficulty : undefined,
    editorial: isProblemEditorialEmpty(editorialParsed)
      ? undefined
      : editorialParsed,
  };
}

export function ProblemDetail({
  problem,
  examples,
  hints,
  starterCode,
  solutions,
  testCases,
}: {
  problem: unknown;
  examples: unknown;
  hints: unknown;
  starterCode: unknown;
  solutions: ProblemSolutionRow[];
  testCases?: unknown;
}) {
  const p = problemRow(problem);
  const exampleList = Array.isArray(examples) ? examples : [];
  const hintList = Array.isArray(hints) ? hints : [];
  const showDifficulty = p.difficulty !== undefined && p.difficulty.length > 0;
  const showDescription =
    p.description !== undefined && p.description.length > 0;
  const showConstraints =
    p.constraints !== undefined &&
    p.constraints !== null &&
    p.constraints.length > 0;
  const editorial = p.editorial ?? null;

  const left = (
    <ProblemDetailLeftPane
      editorial={editorial}
      exampleList={exampleList}
      examples={examples}
      hintList={hintList}
      hints={hints}
      p={p}
      problem={problem}
      showConstraints={showConstraints}
      showDescription={showDescription}
      showDifficulty={showDifficulty}
      solutions={solutions}
    />
  );

  return (
    <SplitLayout
      className="h-full min-h-0 flex-1"
      defaultLeftPercent={46}
      left={left}
      right={
        <ProblemWorkspace starterCode={starterCode} testCases={testCases} />
      }
    />
  );
}
