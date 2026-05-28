import { currentUser } from "@/lib/auth/clerk-server";
import { getNestClerkMe } from "@/lib/auth/nest-clerk-api";
import Link from "next/link";
import { Button } from "@repo/design-system/components/ui/button";

export default async function AccountPage() {
  const [clerkUser, me] = await Promise.all([currentUser(), getNestClerkMe()]);

  return (
    <main className="container mx-auto max-w-lg space-y-8 p-4 md:p-6">
      <h1 className="font-semibold text-2xl">Account</h1>

      <section className="space-y-3">
        <h2 className="font-medium text-lg">Neon profile</h2>
        <p className="text-muted-foreground text-sm">
          Loaded from <code className="text-xs">nest-clerk-api</code> with your
          Clerk session token.
        </p>
        {me.ok ? (
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium">{me.data.email}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Name</dt>
              <dd className="font-medium">{me.data.name || "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Email verified</dt>
              <dd className="font-medium">
                {me.data.emailVerified ? "Yes" : "No"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">User ID</dt>
              <dd className="break-all font-mono text-xs">{me.data.id}</dd>
            </div>
          </dl>
        ) : (
          <p className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm">
            {me.status === 404 ? (
              <>
                Your Clerk account is signed in, but no database profile exists
                yet. After Stage 3 webhook provisioning, refresh this page.
              </>
            ) : (
              <>
                Could not load profile
                {me.status > 0 ? ` (${me.status})` : ""}: {me.message}
              </>
            )}
          </p>
        )}
      </section>

      <section className="space-y-3 border-border border-t pt-6">
        <h2 className="font-medium text-lg">Clerk session</h2>
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-medium">
              {clerkUser?.primaryEmailAddress?.emailAddress ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Name</dt>
            <dd className="font-medium">{clerkUser?.fullName ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Clerk user ID</dt>
            <dd className="break-all font-mono text-xs">
              {clerkUser?.id ?? "—"}
            </dd>
          </div>
        </dl>
      </section>

      <Button asChild variant="outline">
        <Link href="/problems">Back to problems</Link>
      </Button>
    </main>
  );
}
