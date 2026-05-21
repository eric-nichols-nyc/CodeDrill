import { notFound } from "next/navigation";
import { TimerProvider } from "@/components/timer";
import { ProblemDetail } from "@/features/problem-detail/components/problem-detail";
import { ProblemExpandableSidebar } from "@/features/problem-detail/components/problem-expandable-sidebar";
import { ProblemSlugNavHeaderConnected } from "@/features/problem-slug-nav/components/problem-slug-nav-header-connected";
import { buildCatalogSlugs } from "@/features/problem-slug-nav/utils/build-catalog-slugs";
import { parseProblemsListBody } from "@/features/problems-page/lib/parse-problems-list-body";
import { fetchProblemsList } from "@/lib/problems/fetch-problems-list";
import { isProblemSolutionRowArray } from "@/features/problem-detail/problem-detail-helpers";
import type { ProblemSolutionRow } from "@/features/problem-detail/problem-detail-types";
import { fetchProblemBySlug } from "@/lib/problems/fetch-problem-by-slug";

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

function resolveProblemTitle(slug: string, bundle: ProblemDetailBundle | null): string {
  if (!bundle) {
    return slug;
  }
  const p = bundle.problem;
  if (typeof p !== "object" || p === null || !("title" in p)) {
    return slug;
  }
  const t = (p as { title: unknown }).title;
  return typeof t === "string" && t.length > 0 ? t : slug;
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
  const catalogSlugs =
    listResult.ok === true
      ? buildCatalogSlugs(parseProblemsListBody(listResult.body))
      : [];
  console.log("[problems/[slug]]", { slug, body: result.body });

  if (result.status === 404) {
    notFound();
  }

  const bundle =
    result.ok === true && isProblemDetailBundle(result.body)
      ? result.body
      : null;
  const title = resolveProblemTitle(slug, bundle);

  return (
    <TimerProvider>
      <div className="problem-by-slug-page flex h-dvh min-h-0 flex-col overflow-hidden bg-background">
        <ProblemSlugNavHeaderConnected
          catalogSlugs={catalogSlugs}
          currentSlug={slug}
          title={title}
        />

        <main className="flex min-h-0 flex-1 flex-row overflow-hidden">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            {result.ok ? null : (
              <div className="p-6">
                <p className="text-destructive text-sm">
                  Could not load problem (HTTP {result.status}). Set matching{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">
                    INTERNAL_PROBLEMS_SECRET
                  </code>{" "}
                  or use a Better Auth session cookie when calling the API.
                </p>
              </div>
            )}

            {bundle ? (
              <ProblemDetail
                examples={bundle.examples}
                hints={bundle.hints}
                problem={bundle.problem}
                solutions={bundle.solutions}
                starterCode={bundle.starterCode}
                tags={bundle.tags}
                testCases={bundle.testCases}
              />
            ) : (
              <div className="p-6">
                <pre className="overflow-x-auto rounded-md border border-border bg-muted p-4 text-xs">
                  {typeof result.body === "string"
                    ? result.body
                    : JSON.stringify(result.body, null, 2)}
                </pre>
              </div>
            )}
          </div>
          <ProblemExpandableSidebar learningNotes={bundle?.learningNotes} />
        </main>
      </div>
    </TimerProvider>
  );
}
