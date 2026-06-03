"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { seedInterviewSessionAction } from "@/features/interview-player/actions";
import { Button } from "@repo/design-system/components/ui/button";
import type { CandidateProfile, JobAnalysis } from "@/lib/interview-api/types";

type SessionNotFoundProps = {
  profile: CandidateProfile | null;
  jobAnalysis: JobAnalysis | null;
};

export function SessionNotFound({ profile, jobAnalysis }: SessionNotFoundProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSeed = Boolean(profile && jobAnalysis);

  const handleSeed = async () => {
    setLoading(true);
    setError(null);
    const result = await seedInterviewSessionAction();
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    router.push(`/interviews/${result.data.interviewId}/play`);
  };

  return (
    <div className="mx-auto max-w-md space-y-4 rounded-2xl border bg-card p-6">
      <h1 className="font-semibold text-lg">Start interview practice</h1>
      <p className="text-muted-foreground text-sm">
        Creates a session from your latest saved profile and job analysis.
        Questions use topics from your job analysis.
      </p>

      <div className="space-y-3 rounded-lg border bg-muted/30 p-4 text-sm">
        <div>
          <p className="font-medium text-foreground">Profile</p>
          {profile ? (
            <p className="text-muted-foreground">
              {profile.summary.slice(0, 120)}
              {profile.summary.length > 120 ? "…" : ""}
            </p>
          ) : (
            <p className="text-amber-700 dark:text-amber-200">
              None saved —{" "}
              <Link className="underline" href="/profile">
                add profile
              </Link>
            </p>
          )}
        </div>
        <div>
          <p className="font-medium text-foreground">Job analysis</p>
          {jobAnalysis ? (
            <p className="text-muted-foreground">
              <span className="text-foreground">
                {jobAnalysis.roleTitle} — {jobAnalysis.companyName}
              </span>
              {jobAnalysis.suggestedQuestionAngles.length > 0
                ? ` · ${jobAnalysis.suggestedQuestionAngles.length} question angles`
                : null}
            </p>
          ) : (
            <p className="text-amber-700 dark:text-amber-200">
              None saved —{" "}
              <Link className="underline" href="/job-analysis">
                generate and save job analysis
              </Link>
            </p>
          )}
        </div>
      </div>

      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}

      <Button disabled={loading || !canSeed} onClick={handleSeed} type="button">
        {loading ? "Creating…" : "Create interview from job analysis"}
      </Button>
    </div>
  );
}
