import { ProfileWorkspace } from "@/features/profile/components/profile-workspace";
import { InterviewShell } from "@/features/shell/components/interview-shell";
import { InterviewApiError, interviewApiFetch } from "@/lib/interview-api/server";
import type { CandidateProfile } from "@/lib/interview-api/types";
import { getApiAuth } from "@/lib/auth/server";

async function loadLatestProfile(): Promise<CandidateProfile | null> {
  try {
    return await interviewApiFetch<CandidateProfile | null>(
      "/interview/profiles/me"
    );
  } catch (error) {
    if (error instanceof InterviewApiError && error.status === 401) {
      return null;
    }
    return null;
  }
}

export default async function ProfilePage() {
  const { user } = await getApiAuth();
  const initialProfile = user ? await loadLatestProfile() : null;

  return (
    <InterviewShell>
      <section className="container mx-auto max-w-3xl space-y-6 px-4 py-12">
        <div className="space-y-2">
          <h1 className="font-semibold text-2xl tracking-tight">Profile</h1>
          <p className="text-muted-foreground text-sm">
            Paste resume text → generate structured profile → save to Postgres.
            {user?.email ? (
              <>
                {" "}
                Signed in as <span className="text-foreground">{user.email}</span>.
              </>
            ) : null}
          </p>
        </div>
        <ProfileWorkspace initialProfile={initialProfile} />
      </section>
    </InterviewShell>
  );
}
