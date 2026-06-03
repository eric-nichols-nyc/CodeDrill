import { InterviewShell } from "@/features/shell/components/interview-shell";
import { getApiAuth } from "@/lib/auth/server";

export default async function ProfilePage() {
  const { user } = await getApiAuth();

  return (
    <InterviewShell>
      <section className="container mx-auto max-w-2xl space-y-4 px-4 py-12">
        <h1 className="font-semibold text-2xl tracking-tight">Profile</h1>
        <p className="text-muted-foreground text-sm">
          Protected route — resume → AI profile → save will live here. Signed in
          as{" "}
          <span className="font-mono text-foreground">
            {user?.id ?? "unknown"}
          </span>
          {user?.email ? (
            <>
              {" "}
              (<span className="text-foreground">{user.email}</span>)
            </>
          ) : null}
          .
        </p>
      </section>
    </InterviewShell>
  );
}
