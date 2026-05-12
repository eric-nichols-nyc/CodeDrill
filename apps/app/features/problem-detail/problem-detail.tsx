import { SplitLayout } from "@/components/split-layout";
import { JsonFallback } from "@/features/problem-detail/json-fallback";
import {
  asRecord,
  rowKey,
} from "@/features/problem-detail/problem-detail-helpers";
import { ProblemDetailLeftPane } from "@/features/problem-detail/problem-detail-left-pane";
import type { ProblemRow } from "@/features/problem-detail/problem-detail-types";
import { ProblemOutputPanel } from "@/features/problem-detail/problem-output-panel";
import { Sandbox } from "@/features/problem-detail/sandbox";

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
  return {
    title: typeof o.title === "string" ? o.title : undefined,
    description: typeof o.description === "string" ? o.description : undefined,
    constraints: pickConstraints(o.constraints),
    difficulty: typeof o.difficulty === "string" ? o.difficulty : undefined,
    editorial: pickConstraints(o.editorial),
  };
}

export function ProblemDetail({
  problem,
  examples,
  hints,
  starterCode,
  learningNotes,
  solutions,
}: {
  problem: unknown;
  examples: unknown;
  hints: unknown;
  starterCode: unknown;
  learningNotes: unknown;
  solutions: unknown;
}) {
  const p = problemRow(problem);
  const exampleList = Array.isArray(examples) ? examples : [];
  const hintList = Array.isArray(hints) ? hints : [];
  const codeRows = Array.isArray(starterCode) ? starterCode : [];
  const showDifficulty = p.difficulty !== undefined && p.difficulty.length > 0;
  const showDescription =
    p.description !== undefined && p.description.length > 0;
  const showConstraints =
    p.constraints !== undefined &&
    p.constraints !== null &&
    p.constraints.length > 0;
  const editorial =
    typeof p.editorial === "string" && p.editorial.length > 0
      ? p.editorial
      : null;

  const left = (
    <ProblemDetailLeftPane
      editorial={editorial}
      exampleList={exampleList}
      examples={examples}
      hintList={hintList}
      hints={hints}
      learningNotes={learningNotes}
      p={p}
      problem={problem}
      showConstraints={showConstraints}
      showDescription={showDescription}
      showDifficulty={showDifficulty}
      solutions={solutions}
    />
  );

  const starterBody =
    codeRows.length === 0 ? (
      <JsonFallback data={starterCode} />
    ) : (
      <div className="space-y-4">
        {codeRows.map((row, i) => (
          <Sandbox key={rowKey(asRecord(row), `sc-${i}`)} row={row} />
        ))}
      </div>
    );

  const starterPanel = (
    <div className="flex h-full min-h-0 flex-col gap-3 p-4 pl-3">
      <div className="min-h-0 flex-1 overflow-auto">{starterBody}</div>
    </div>
  );

  const right = (
    <SplitLayout
      className="h-full min-h-0 w-full flex-1"
      defaultLeftPercent={55}
      left={starterPanel}
      minLeftPx={100}
      minRightPx={96}
      orientation="horizontal"
      right={<ProblemOutputPanel />}
    />
  );

  return (
    <SplitLayout
      className="h-full min-h-0 flex-1"
      defaultLeftPercent={46}
      left={left}
      right={right}
    />
  );
}
