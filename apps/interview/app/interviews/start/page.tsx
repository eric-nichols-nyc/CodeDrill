import { InterviewStartPanel } from "@/features/interview-player/components/interview-start-panel";
import { InterviewShell } from "@/features/shell/components/interview-shell";
import { InterviewApiError, interviewApiFetch } from "@/lib/interview-api/server";
import type { CandidateProfile, JobAnalysis } from "@/lib/interview-api/types";
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

export default async function InterviewStartPage() {
  const { user } = await getApiAuth();
  const profile = user ? await loadLatestProfile() : null;
  const jobAnalysis = user ? await loadLatestJobAnalysis() : null;

  return (
    <InterviewShell>
      <section className="container mx-auto px-4 py-12">
        {!user ? (
          <p className="text-muted-foreground text-sm">Sign in to start an interview.</p>
        ) : (
          <InterviewStartPanel jobAnalysis={jobAnalysis} profile={profile} />
        )}
      </section>
    </InterviewShell>
  );
}
