import { NewProblemForm } from "./new-problem-form";
import { getNeonAuth } from "@/lib/auth/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const { session } = await getNeonAuth();

  if (!session) {
    redirect("/auth/sign-in?next=/admin");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="font-semibold text-2xl">Admin</h1>
        <Link className="text-primary text-sm underline-offset-4 hover:underline" href="/dashboard">
          Dashboard
        </Link>
      </div>

      <p className="text-muted-foreground text-sm">
        Creates a problem via the Nest API (
        <code className="rounded bg-muted px-1 py-0.5 text-xs">POST /problems</code>
        ). Set <code className="rounded bg-muted px-1 py-0.5 text-xs">NEON_JWT_API_URL</code> if
        the API is not on <code className="rounded bg-muted px-1 py-0.5 text-xs">http://localhost:3030</code>
        . Neon Auth does not send Better Auth cookies to that API, so set the same{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">INTERNAL_PROBLEMS_SECRET</code>{" "}
        in this app and in <code className="rounded bg-muted px-1 py-0.5 text-xs">neon-jwt-api</code>{" "}
        (see <code className="rounded bg-muted px-1 py-0.5 text-xs">.env.example</code> in both).
      </p>

      <section className="space-y-4">
        <h2 className="font-medium text-lg">New problem</h2>
        <NewProblemForm />
      </section>
    </div>
  );
}
