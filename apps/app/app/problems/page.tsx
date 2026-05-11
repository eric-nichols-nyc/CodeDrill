import Link from "next/link";
import { fetchProblemsList } from "@/lib/problems/fetch-problems-list";

export default async function ProblemsPage() {
  const result = await fetchProblemsList();

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

      <pre className="overflow-x-auto rounded-md border border-border bg-muted p-4 text-xs">
        {JSON.stringify(result.body, null, 2)}
      </pre>
    </div>
  );
}
