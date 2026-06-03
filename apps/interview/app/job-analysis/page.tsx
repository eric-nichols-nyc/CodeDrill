import { JobAnalysisWorkspace } from "@/features/job-analysis/components/job-analysis-workspace";
import { InterviewShell } from "@/features/shell/components/interview-shell";
import { InterviewApiError, interviewApiFetch } from "@/lib/interview-api/server";
import type { JobAnalysis } from "@/lib/interview-api/types";
import { getApiAuth } from "@/lib/auth/server";

async function loadLatestJobAnalysis(): Promise<JobAnalysis | null> {
  try {
    return await interviewApiFetch<JobAnalysis | null>(
      "/interview/job-analyses/me"
    );
  } catch (error) {
    if (error instanceof InterviewApiError && error.status === 401) {
      return null;
    }
    return null;
  }
}

export default async function JobAnalysisPage() {
  const { user } = await getApiAuth();
  const initialAnalysis = user ? await loadLatestJobAnalysis() : null;

  return (
    <InterviewShell>
      <section className="container mx-auto max-w-3xl space-y-6 px-4 py-12">
        <div className="space-y-2">
          <h1 className="font-semibold text-2xl tracking-tight">Job analysis</h1>
          <p className="text-muted-foreground text-sm">
            Paste job description → generate hiring intelligence → save to
            Postgres.
            {user?.email ? (
              <>
                {" "}
                Signed in as <span className="text-foreground">{user.email}</span>.
              </>
            ) : null}
          </p>
        </div>
        <JobAnalysisWorkspace initialAnalysis={initialAnalysis} />
      </section>
    </InterviewShell>
  );
}
