import Link from "next/link";
import { notFound } from "next/navigation";
import { ProblemDetail } from "@/features/problem-detail/components/problem-detail";
import { ProblemExpandableSidebar } from "@/features/problem-detail/components/problem-expandable-sidebar";
import { isProblemSolutionRowArray } from "@/features/problem-detail/problem-detail-helpers";
import type { ProblemSolutionRow } from "@/features/problem-detail/problem-detail-types";
import { fetchProblemBySlug } from "@/lib/problems/fetch-problem-by-slug";

type ProblemDetailBundle = {
  problem: unknown;
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

export default async function ProblemBySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await fetchProblemBySlug(slug);
  console.log("[problems/[slug]]", { slug, body: result.body });

  if (result.status === 404) {
    notFound();
  }

  let title = slug;
  const bundle =
    result.ok === true && isProblemDetailBundle(result.body)
      ? result.body
      : null;

  if (bundle) {
    const p = bundle.problem;
    if (typeof p === "object" && p !== null && "title" in p) {
      const t = (p as { title: unknown }).title;
      if (typeof t === "string" && t.length > 0) {
        title = t;
      }
    }
  }

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-background">
      <header className="flex h-12 shrink-0 items-center gap-6 border-border/35 border-b px-4">
        <Link
          className="text-muted-foreground text-sm transition-colors hover:text-foreground"
          href="/"
        >
          Home
        </Link>
        <Link
          className="text-muted-foreground text-sm transition-colors hover:text-foreground"
          href="/problems"
        >
          All problems
        </Link>
        <span className="truncate font-medium text-sm" title={title}>
          {title}
        </span>
      </header>

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
  );
}
