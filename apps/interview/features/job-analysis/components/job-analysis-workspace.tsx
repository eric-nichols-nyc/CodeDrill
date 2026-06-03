"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import { Textarea } from "@repo/design-system/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  generateJobAnalysisAction,
  getLatestJobAnalysisAction,
  saveJobAnalysisAction,
} from "@/features/job-analysis/actions";
import type { JobAnalysis, JobAnalysisPayload } from "@/lib/interview-api/types";

type JobAnalysisWorkspaceProps = {
  initialAnalysis: JobAnalysis | null;
};

export function JobAnalysisWorkspace({
  initialAnalysis,
}: JobAnalysisWorkspaceProps) {
  const router = useRouter();
  const [jobDescription, setJobDescription] = useState(
    initialAnalysis?.jobDescription ?? ""
  );
  const [jobUrl, setJobUrl] = useState(initialAnalysis?.jobUrl ?? "");
  const [companyName, setCompanyName] = useState(
    initialAnalysis?.companyName ?? ""
  );
  const [roleTitle, setRoleTitle] = useState(initialAnalysis?.roleTitle ?? "");
  const [draft, setDraft] = useState<JobAnalysisPayload | null>(null);
  const [saved, setSaved] = useState<JobAnalysis | null>(initialAnalysis);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onGenerate() {
    setError(null);
    startTransition(async () => {
      const result = await generateJobAnalysisAction({
        jobDescription,
        jobUrl: jobUrl || undefined,
        companyName: companyName || undefined,
        roleTitle: roleTitle || undefined,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setDraft(result.data);
    });
  }

  function onSave() {
    if (!draft) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await saveJobAnalysisAction(
        jobDescription,
        draft,
        jobUrl || undefined
      );
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSaved(result.data);
      setDraft(null);
      setJobDescription(result.data.jobDescription);
      router.refresh();
    });
  }

  function onReloadSaved() {
    setError(null);
    startTransition(async () => {
      const result = await getLatestJobAnalysisAction();
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSaved(result.data);
      if (result.data) {
        setJobDescription(result.data.jobDescription);
        setJobUrl(result.data.jobUrl ?? "");
        setCompanyName(result.data.companyName);
        setRoleTitle(result.data.roleTitle);
      }
    });
  }

  const display = saved ?? draft;

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company (optional)</Label>
            <Input
              id="company-name"
              onChange={(event) => setCompanyName(event.target.value)}
              placeholder="e.g. Acme Corp"
              value={companyName}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role-title">Role title (optional)</Label>
            <Input
              id="role-title"
              onChange={(event) => setRoleTitle(event.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              value={roleTitle}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="job-url">Job URL (optional)</Label>
          <Input
            id="job-url"
            onChange={(event) => setJobUrl(event.target.value)}
            placeholder="https://…"
            type="url"
            value={jobUrl}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="job-description">Job description</Label>
          <Textarea
            className="min-h-[220px] text-sm"
            id="job-description"
            onChange={(event) => setJobDescription(event.target.value)}
            placeholder="Paste the job description…"
            value={jobDescription}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            disabled={isPending || jobDescription.trim().length === 0}
            onClick={onGenerate}
            type="button"
          >
            {isPending ? "Working…" : "Generate analysis"}
          </Button>
          <Button disabled={isPending || !draft} onClick={onSave} type="button">
            Save analysis
          </Button>
          <Button
            disabled={isPending}
            onClick={onReloadSaved}
            type="button"
            variant="outline"
          >
            Reload saved
          </Button>
        </div>
        {error ? (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      {display ? (
        <article className="space-y-6 rounded-lg border bg-card p-6">
          <header className="space-y-1">
            <h2 className="font-semibold text-lg">
              {saved ? "Saved job analysis" : "Generated preview"}
            </h2>
            <p className="font-medium text-sm">
              {display.companyName} — {display.roleTitle}
            </p>
            <p className="text-muted-foreground text-sm">
              Seniority: {display.seniorityLevel.level} (
              {display.seniorityLevel.confidence} confidence)
            </p>
            {saved ? (
              <p className="font-mono text-muted-foreground text-xs">
                {saved.id} · updated {saved.updatedAt}
              </p>
            ) : (
              <p className="text-muted-foreground text-sm">
                Review the extraction, then save to persist.
              </p>
            )}
          </header>

          <section className="space-y-2">
            <h3 className="font-medium text-sm">Role summary</h3>
            <p className="text-sm leading-relaxed">{display.roleSummary}</p>
          </section>

          {display.requiredSkills.length > 0 ? (
            <section className="space-y-2">
              <h3 className="font-medium text-sm">Required skills</h3>
              <ul className="flex flex-wrap gap-2">
                {display.requiredSkills.map((skill) => (
                  <li
                    className="rounded-md border bg-muted/50 px-2 py-0.5 text-xs"
                    key={skill}
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {display.niceToHaveSkills.length > 0 ? (
            <section className="space-y-2">
              <h3 className="font-medium text-sm">Nice to have</h3>
              <ul className="flex flex-wrap gap-2">
                {display.niceToHaveSkills.map((skill) => (
                  <li
                    className="rounded-md border px-2 py-0.5 text-muted-foreground text-xs"
                    key={skill}
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {display.likelyInterviewCategories.length > 0 ? (
            <section className="space-y-2">
              <h3 className="font-medium text-sm">Likely interview categories</h3>
              <ul className="flex flex-wrap gap-2">
                {display.likelyInterviewCategories.map((category) => (
                  <li
                    className="rounded-md border px-2 py-0.5 text-xs"
                    key={category}
                  >
                    {category}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {display.mustProve.length > 0 ? (
            <section className="space-y-2">
              <h3 className="font-medium text-sm">What you must prove</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {display.mustProve.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {display.hiddenExpectations.length > 0 ? (
            <section className="space-y-3">
              <h3 className="font-medium text-sm">Hidden expectations</h3>
              <ul className="space-y-2 text-sm">
                {display.hiddenExpectations.map((item) => (
                  <li className="rounded-md border p-3" key={item.expectation}>
                    <p className="font-medium">{item.expectation}</p>
                    <p className="mt-1 text-muted-foreground text-xs">
                      {item.reason}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {display.interviewSignals.length > 0 ? (
            <section className="space-y-2">
              <h3 className="font-medium text-sm">Interview signals</h3>
              <ul className="flex flex-wrap gap-2">
                {display.interviewSignals.map((signal) => (
                  <li
                    className="rounded-md border bg-muted/30 px-2 py-0.5 text-xs"
                    key={signal}
                  >
                    {signal}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {display.suggestedQuestionAngles.length > 0 ? (
            <section className="space-y-3">
              <h3 className="font-medium text-sm">Suggested question angles</h3>
              <ul className="space-y-2 text-sm">
                {display.suggestedQuestionAngles.map((item) => (
                  <li
                    className="rounded-md border p-3"
                    key={`${item.category}-${item.angle}`}
                  >
                    <p className="font-medium text-xs uppercase tracking-wide text-muted-foreground">
                      {item.category}
                    </p>
                    <p className="mt-1">{item.angle}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </article>
      ) : (
        <p className="text-muted-foreground text-sm">
          Paste a job description and generate structured hiring intelligence, or
          reload a saved analysis from the database.
        </p>
      )}
    </div>
  );
}
