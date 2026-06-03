import { InterviewPlayer } from "@/features/interview-player/components/interview-player";
import { SessionNotFound } from "@/features/interview-player/components/session-not-found";
import { InterviewShell } from "@/features/shell/components/interview-shell";
import { InterviewApiError, interviewApiFetch } from "@/lib/interview-api/server";
import type {
  CandidateProfile,
  InterviewSession,
  JobAnalysis,
} from "@/lib/interview-api/types";
import { getApiAuth } from "@/lib/auth/server";
import { isUuid } from "@/lib/is-uuid";

type PlayPageProps = {
  params: Promise<{ interviewId: string }>;
};

async function loadSession(
  interviewId: string
): Promise<InterviewSession | null> {
  try {
    return await interviewApiFetch<InterviewSession>(
      `/interview/sessions/${interviewId}`
    );
  } catch (error) {
    if (
      error instanceof InterviewApiError &&
      (error.status === 404 || error.status === 400)
    ) {
      return null;
    }
    throw error;
  }
}

async function loadLatestProfile(): Promise<CandidateProfile | null> {
  try {
    return await interviewApiFetch<CandidateProfile | null>(
      "/interview/profiles/me"
    );
  } catch {
    return null;
  }
}

async function loadLatestJobAnalysis(): Promise<JobAnalysis | null> {
  try {
    return await interviewApiFetch<JobAnalysis | null>(
      "/interview/job-analyses/me"
    );
  } catch {
    return null;
  }
}

export default async function InterviewPlayPage({ params }: PlayPageProps) {
  const { interviewId } = await params;
  const { user } = await getApiAuth();

  if (!user) {
    return (
      <InterviewShell>
        <section className="container mx-auto max-w-2xl px-4 py-12">
          <p className="text-muted-foreground text-sm">Sign in to play an interview.</p>
        </section>
      </InterviewShell>
    );
  }

  const session = isUuid(interviewId) ? await loadSession(interviewId) : null;

  if (!session) {
    const [profile, jobAnalysis] = await Promise.all([
      loadLatestProfile(),
      loadLatestJobAnalysis(),
    ]);
    return (
      <InterviewShell>
        <section className="container mx-auto px-4 py-12">
          <SessionNotFound jobAnalysis={jobAnalysis} profile={profile} />
        </section>
      </InterviewShell>
    );
  }

  return (
    <InterviewShell className="[&_main]:p-0">
      <InterviewPlayer initialSession={session} />
    </InterviewShell>
  );
}
