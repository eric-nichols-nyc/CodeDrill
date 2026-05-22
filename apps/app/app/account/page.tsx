import { getApiAuth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@repo/design-system/components/ui/button";

export default async function AccountPage() {
  const { session, user } = await getApiAuth();

  if (!session) {
    redirect("/auth/sign-in?next=/account");
  }

  return (
    <main className="container mx-auto max-w-lg space-y-6 p-4 md:p-6">
      <h1 className="font-semibold text-2xl">Account</h1>
      <dl className="space-y-3 text-sm">
        <div>
          <dt className="text-muted-foreground">Email</dt>
          <dd className="font-medium">{user?.email ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Name</dt>
          <dd className="font-medium">{user?.name ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">User ID</dt>
          <dd className="break-all font-mono text-xs">{user?.id ?? "—"}</dd>
        </div>
      </dl>
      <Button asChild variant="outline">
        <Link href="/dashboard">Back to dashboard</Link>
      </Button>
    </main>
  );
}
