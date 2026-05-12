import Link from "next/link";
import { fetchProblemsList } from "@/lib/problems/fetch-problems-list";

function problemRowsFromBody(body: unknown) {
  if (!Array.isArray(body)) {
    return [];
  }
  return body.flatMap((item) => {
    if (typeof item !== "object" || item === null) {
      return [];
    }
    const o = item as Record<string, unknown>;
    if (typeof o.slug !== "string" || typeof o.title !== "string") {
      return [];
    }
    return [
      {
        slug: o.slug,
        title: o.title,
        difficulty: typeof o.difficulty === "string" ? o.difficulty : undefined,
      },
    ];
  });
}

export default async function ProblemsPage() {
  const result = await fetchProblemsList();
  const rows = result.ok ? problemRowsFromBody(result.body) : [];
  const showEmptyList = Boolean(result.ok && rows.length === 0);

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="font-semibold text-2xl">Problems</h1>
        <Link className="text-primary text-sm underline-offset-4 hover:underline" href="/">
          Home
        </Link>
      </div>

      {result.ok ? null : (
        <p className="text-destructive text-sm">
          Could not load problems (HTTP {result.status}). For server-side access from this app, set
          matching{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">INTERNAL_PROBLEMS_SECRET</code>{" "}
          here and on the Nest API, or call the API with a Better Auth session cookie.
        </p>
      )}

      {showEmptyList ? (
        <p className="text-muted-foreground text-sm">No problems yet.</p>
      ) : null}

      {rows.length > 0 ? (
        <ul className="divide-y divide-border rounded-md border border-border">
          {rows.map((row) => (
            <li key={row.slug}>
              <Link
                className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3 text-sm hover:bg-muted/60"
                href={`/problems/${encodeURIComponent(row.slug)}`}
              >
                <span className="font-medium text-foreground">{row.title}</span>
                {row.difficulty ? (
                  <span className="text-muted-foreground capitalize">{row.difficulty}</span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
