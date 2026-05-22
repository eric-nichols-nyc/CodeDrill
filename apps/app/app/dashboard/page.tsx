import { getApiAuth } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { session, user } = await getApiAuth();

  if (!session) {
    redirect("/auth/sign-in?next=/dashboard");
  }

  return (
    <div className="mx-auto max-w-xl space-y-4 p-6">
      <h1 className="font-semibold text-2xl">Dashboard</h1>

      <p className="text-muted-foreground">
        Signed in as{" "}
        <span className="font-medium text-foreground">
          {user?.email ?? user?.name ?? "user"}
        </span>
      </p>

      {user?.id ? (
        <p className="text-muted-foreground text-sm">
          User ID: <code className="font-mono text-xs">{user.id}</code>
        </p>
      ) : null}
    </div>
  );
}
