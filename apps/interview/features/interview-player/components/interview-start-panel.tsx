"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createInterviewSessionAction,
  generateInterviewBlueprintAction,
  seedInterviewSessionAction,
} from "@/features/interview-player/actions";
import { Button } from "@repo/design-system/components/ui/button";
import type {
  CandidateProfile,
  InterviewBlueprintPreview,
  JobAnalysis,
} from "@/lib/interview-api/types";

type InterviewStartPanelProps = {
  profile: CandidateProfile | null;
  jobAnalysis: JobAnalysis | null;
};

export function InterviewStartPanel({
  profile,
  jobAnalysis,
}: InterviewStartPanelProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [creating, setCreating] = useState(false);
  const [preview, setPreview] = useState<InterviewBlueprintPreview | null>(
    null
  );

  const canGenerate = Boolean(profile && jobAnalysis);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    setPreview(null);
    const result = await generateInterviewBlueprintAction();
    setGenerating(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setPreview(result.data);
  };

  const handleCreate = async () => {
    if (!preview) {
      return;
    }

    setCreating(true);
    setError(null);
    const result = await createInterviewSessionAction({
      profileId: preview.profileId,
      jobAnalysisId: preview.jobAnalysisId,
      blueprint: {
        interviewTitle: preview.interviewTitle,
        estimatedDurationMinutes: preview.estimatedDurationMinutes,
        categories: preview.categories,
        questions: preview.questions,
      },
    });
    setCreating(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    router.push(`/interviews/${result.data.interviewId}/play`);
  };

  const handleDevSeed = async () => {
    setGenerating(true);
    setError(null);
    const result = await seedInterviewSessionAction();
    setGenerating(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    router.push(`/interviews/${result.data.interviewId}/play`);
  };

  return (
    <div className="mx-auto max-w-lg space-y-4 rounded-2xl border bg-card p-6">
      <h1 className="font-semibold text-lg">Start interview practice</h1>
      <p className="text-muted-foreground text-sm">
        Generate a tailored interview from your saved profile and job analysis,
        then practice question by question with voice or text.
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

      {preview ? (
        <div className="space-y-3 rounded-lg border p-4">
          <div>
            <p className="font-medium text-foreground">{preview.interviewTitle}</p>
            <p className="text-muted-foreground text-xs">
              {preview.questionCount} questions · ~
              {preview.estimatedDurationMinutes} min ·{" "}
              {preview.categories.slice(0, 4).join(", ")}
              {preview.categories.length > 4 ? "…" : ""}
            </p>
          </div>
          <ol className="max-h-48 list-decimal space-y-2 overflow-y-auto pl-5 text-sm">
            {preview.questions.map((q) => (
              <li key={q.order} className="text-muted-foreground">
                <span className="text-foreground/90">{q.category}:</span>{" "}
                {q.question.slice(0, 140)}
                {q.question.length > 140 ? "…" : ""}
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-2">
            <Button
              disabled={creating}
              onClick={() => void handleCreate()}
              type="button"
            >
              {creating ? "Starting…" : "Start practice"}
            </Button>
            <Button
              disabled={generating || creating}
              onClick={() => void handleGenerate()}
              type="button"
              variant="outline"
            >
              Regenerate
            </Button>
          </div>
        </div>
      ) : (
        <Button
          disabled={generating || !canGenerate}
          onClick={() => void handleGenerate()}
          type="button"
        >
          {generating ? "Generating…" : "Generate interview"}
        </Button>
      )}

      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}

      <p className="text-muted-foreground text-xs">
        Dev shortcut:{" "}
        <button
          className="underline disabled:opacity-50"
          disabled={generating || !canGenerate}
          onClick={() => void handleDevSeed()}
          type="button"
        >
          quick seed (3 questions)
        </button>
      </p>
    </div>
  );
}
