import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { TimerProvider } from "@/components/timer";
import { ProblemSlugNavHeaderConnected } from "@/features/problem-slug-nav/components/problem-slug-nav-header-connected";
import { buildCatalogSlugs } from "@/features/problem-slug-nav/utils/build-catalog-slugs";
import { ProblemWorkspace } from "./problem-workspace";
import {
  asRecord,
  isProblemSolutionRowArray,
} from "@/features/problem-workspace/problem-detail-helpers";
import type { ProblemSolutionRow } from "@/features/problem-workspace/problem-detail-types";
import { mapRowsToProblems } from "@/features/problems-page/lib/map-rows-to-problems";
import { parseProblemsListBody } from "@/features/problems-page/lib/parse-problems-list-body";
import type { Problem } from "@/features/problems-page/lib/types";
import { fetchProblemBySlug } from "@/lib/problems/fetch-problem-by-slug";
import {
  fetchProblemsList,
  type ProblemsListResult,
} from "@/lib/problems/fetch-problems-list";

type ProblemDetailBundle = {
  problem: unknown;
  tags?: unknown;
  examples: unknown;
  hints: unknown;
  starterCode: unknown;
  learningNotes: unknown;
  solutions: ProblemSolutionRow[];
  testCases?: unknown;
};

function problemIdFrom(problem: unknown): string | undefined {
  const id = asRecord(problem)?.id;
  return typeof id === "string" && id.length > 0 ? id : undefined;
}

function parseCatalogFromList(listResult: ProblemsListResult): {
  problems: Problem[];
  catalogSlugs: string[];
} {
  const rows = listResult.ok ? parseProblemsListBody(listResult.body) : [];
  return {
    problems: mapRowsToProblems(rows),
    catalogSlugs: buildCatalogSlugs(rows),
  };
}

function resolveTitle(
  slug: string,
  bundle: ProblemDetailBundle | null
): string {
  if (!bundle) {
    return slug;
  }
  const p = bundle.problem;
  if (typeof p === "object" && p !== null && "title" in p) {
    const t = (p as { title: unknown }).title;
    if (typeof t === "string" && t.length > 0) {
      return t;
    }
  }
  return slug;
}

function isProblemDetailBundle(value: unknown): value is ProblemDetailBundle {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const o = value as Record<string, unknown>;
  return (
    "problem" in o &&
    "examples" in o &&
    "hints" in o &&
    "starterCode" in o &&
    "learningNotes" in o &&
    "solutions" in o &&
    isProblemSolutionRowArray(o.solutions)
  );
}

export default async function ProblemBySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [result, listResult] = await Promise.all([
    fetchProblemBySlug(slug),
    fetchProblemsList(),
  ]);
  const { problems, catalogSlugs } = parseCatalogFromList(listResult);

  if (result.status === 404) {
    notFound();
  }

  const bundle =
    result.ok === true && isProblemDetailBundle(result.body)
      ? result.body
      : null;
  const title = resolveTitle(slug, bundle);

  let loadIssueBanner: ReactNode = null;
  if (!result.ok) {
    loadIssueBanner = (
      <div className="shrink-0 border-border border-b p-4">
        <p className="text-destructive text-sm">
          Could not load problem (HTTP {result.status}). Ensure the Nest API is
          running, sign in, or set optional{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            INTERNAL_PROBLEMS_SECRET
          </code>{" "}
          for server-side catalog access.
        </p>
      </div>
    );
  } else if (bundle === null) {
    loadIssueBanner = (
      <div className="shrink-0 border-border border-b p-4">
        <pre className="overflow-x-auto rounded-md border border-border bg-muted p-4 text-xs">
          {typeof result.body === "string"
            ? result.body
            : JSON.stringify(result.body, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <TimerProvider>
      <div className="problem-by-slug-page flex h-dvh min-h-0 flex-col overflow-hidden bg-background">
        <ProblemSlugNavHeaderConnected
          catalogSlugs={catalogSlugs}
          currentSlug={slug}
          fetchOk={listResult.ok}
          fetchStatus={listResult.status}
          problems={problems}
          title={title}
        />

        {loadIssueBanner}

        {bundle ? (
          <ProblemWorkspace
            data={{
              problemId: problemIdFrom(bundle.problem),
              problem: bundle.problem,
              examples: bundle.examples,
              hints: bundle.hints,
              starterCode: bundle.starterCode,
              testCases: bundle.testCases,
              learningNotes: bundle.learningNotes,
              solutions: bundle.solutions,
              tags: bundle.tags,
            }}
          />
        ) : null}
      </div>
    </TimerProvider>
  );
}
