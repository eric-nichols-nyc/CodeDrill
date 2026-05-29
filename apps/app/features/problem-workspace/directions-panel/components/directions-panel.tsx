"use client";

import {
  isProblemEditorialEmpty,
  parseProblemEditorial,
} from "@/features/problem-workspace/directions-panel/lib/parse-editorial";
import {
  asRecord,
  parseProblemTags,
} from "@/features/problem-workspace/directions-panel/lib/problem-detail-helpers";
import type { ProblemRow } from "@/features/problem-workspace/directions-panel/lib/problem-detail-types";
import { ShellPanel } from "@/features/problem-workspace/shell/shell-panel";
import { useWorkspace } from "@/features/problem-workspace/shell/workspace-provider";
import { DirectionsLeftPane } from "./directions-left-pane";

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
  const hasVisualizer =
    o.hasVisualizer === true ||
    o.has_visualizer === true;

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

export function DirectionsPanel() {
  const { data } = useWorkspace();
  const p = problemRow(data.problem);
  const exampleList = Array.isArray(data.examples) ? data.examples : [];
  const hintList = Array.isArray(data.hints) ? data.hints : [];
  const showDifficulty = p.difficulty !== undefined && p.difficulty.length > 0;
  const showDescription =
    p.description !== undefined && p.description.length > 0;
  const showConstraints =
    p.constraints !== undefined &&
    p.constraints !== null &&
    p.constraints.length > 0;
  const editorial = p.editorial ?? null;
  const tags = parseProblemTags(data.tags);

  return (
    <ShellPanel>
      <DirectionsLeftPane
        editorial={editorial}
        exampleList={exampleList}
        examples={data.examples}
        hintList={hintList}
        hints={data.hints}
        p={p}
        problem={data.problem}
        showConstraints={showConstraints}
        showDescription={showDescription}
        showDifficulty={showDifficulty}
        solutions={data.solutions}
        tags={tags}
      />
    </ShellPanel>
  );
}
