"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Textarea } from "@repo/design-system/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  generateProfileAction,
  getLatestProfileAction,
  saveProfileAction,
} from "@/features/profile/actions";
import type { CandidateProfile, ProfilePayload } from "@/lib/interview-api/types";

type ProfileWorkspaceProps = {
  initialProfile: CandidateProfile | null;
};

export function ProfileWorkspace({ initialProfile }: ProfileWorkspaceProps) {
  const router = useRouter();
  const [resumeText, setResumeText] = useState("");
  const [draft, setDraft] = useState<ProfilePayload | null>(null);
  const [saved, setSaved] = useState<CandidateProfile | null>(initialProfile);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onGenerate() {
    setError(null);
    startTransition(async () => {
      const result = await generateProfileAction(resumeText);
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
      const result = await saveProfileAction(resumeText, draft);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSaved(result.data);
      setDraft(null);
      router.refresh();
    });
  }

  function onReloadSaved() {
    setError(null);
    startTransition(async () => {
      const result = await getLatestProfileAction();
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSaved(result.data);
    });
  }

  const display = saved ?? draft;

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <label className="font-medium text-sm" htmlFor="resume-text">
          Resume text
        </label>
        <Textarea
          className="min-h-[220px] font-mono text-sm"
          id="resume-text"
          onChange={(event) => setResumeText(event.target.value)}
          placeholder="Paste your resume here…"
          value={resumeText}
        />
        <div className="flex flex-wrap gap-2">
          <Button
            disabled={isPending || resumeText.trim().length === 0}
            onClick={onGenerate}
            type="button"
          >
            {isPending ? "Working…" : "Generate profile"}
          </Button>
          <Button
            disabled={isPending || !draft}
            onClick={onSave}
            type="button"
            variant="default"
          >
            Save profile
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
              {saved ? "Saved profile" : "Generated preview"}
            </h2>
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
            <h3 className="font-medium text-sm">Summary</h3>
            <p className="text-sm leading-relaxed">{display.summary}</p>
          </section>

          {display.coreSkills.length > 0 ? (
            <section className="space-y-2">
              <h3 className="font-medium text-sm">Core skills</h3>
              <ul className="flex flex-wrap gap-2">
                {display.coreSkills.map((skill) => (
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

          {display.projects.length > 0 ? (
            <section className="space-y-3">
              <h3 className="font-medium text-sm">Projects</h3>
              <ul className="space-y-3">
                {display.projects.map((project) => (
                  <li className="rounded-md border p-3 text-sm" key={project.name}>
                    <p className="font-medium">
                      {project.name} — {project.role}
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                      {project.claims.map((claim) => (
                        <li key={claim}>{claim}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {display.claimsToVerify.length > 0 ? (
            <section className="space-y-3">
              <h3 className="font-medium text-sm">Claims to verify</h3>
              <ul className="space-y-2 text-sm">
                {display.claimsToVerify.map((item) => (
                  <li className="rounded-md border p-3" key={item.claim}>
                    <p className="font-medium">{item.claim}</p>
                    <p className="mt-1 text-muted-foreground text-xs">
                      {item.questionAngle}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {(display.strengthAreas.length > 0 ||
            display.potentialGapAreas.length > 0) && (
            <div className="grid gap-4 sm:grid-cols-2">
              {display.strengthAreas.length > 0 ? (
                <section className="space-y-2">
                  <h3 className="font-medium text-sm">Strength areas</h3>
                  <ul className="list-disc space-y-1 pl-5 text-sm">
                    {display.strengthAreas.map((area) => (
                      <li key={area}>{area}</li>
                    ))}
                  </ul>
                </section>
              ) : null}
              {display.potentialGapAreas.length > 0 ? (
                <section className="space-y-2">
                  <h3 className="font-medium text-sm">Potential gap areas</h3>
                  <ul className="list-disc space-y-1 pl-5 text-sm">
                    {display.potentialGapAreas.map((area) => (
                      <li key={area}>{area}</li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
          )}
        </article>
      ) : (
        <p className="text-muted-foreground text-sm">
          Paste resume text and generate a structured profile, or reload a saved
          profile from the database.
        </p>
      )}
    </div>
  );
}
