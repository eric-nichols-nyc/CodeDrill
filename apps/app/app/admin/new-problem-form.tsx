"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import { Textarea } from "@repo/design-system/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { DevAdminProblemFill } from "@/components/dev-admin-problem-fill";
import type { CreateProblemBody } from "@/lib/admin/create-problem-schema";
import { buildProblemPayload, formatSubmitError } from "@/lib/admin/build-problem-payload";

const emptyForm: CreateProblemBody = {
  title: "",
  slug: "",
  difficulty: "easy",
  description: "",
  constraints: "",
  isPublished: false,
  patternSlug: "",
  loopStructure: "",
  skillFocus: "",
  tutorLevel: "",
  visualizationNotes: "",
};

const SELECT_TRIGGER =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30";

export function NewProblemForm() {
  const router = useRouter();
  const [values, setValues] = useState(emptyForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState<string | null>(null);

  const set =
    (key: keyof CreateProblemBody) =>
    (v: string | boolean) => {
      setValues((prev) => ({ ...prev, [key]: v }));
    };

  const handleDevFill = useCallback((sample: CreateProblemBody) => {
    setValues(sample);
    setMessage(null);
    setStatus("idle");
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setMessage(null);

    const res = await fetch("/api/admin/problems", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(buildProblemPayload(values)),
    });

    const text = await res.text();
    let body: unknown;
    try {
      body = JSON.parse(text) as unknown;
    } catch {
      body = text;
    }

    if (!res.ok) {
      setStatus("error");
      setMessage(formatSubmitError(body, res.status));
      return;
    }

    setStatus("success");
    setMessage("Problem created.");
    setValues(emptyForm);
    router.refresh();
  }

  return (
    <form className="space-y-6" id="admin-new-problem" onSubmit={onSubmit}>
      <DevAdminProblemFill onFill={handleDevFill} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input
            autoComplete="off"
            id="title"
            onChange={(e) => set("title")(e.target.value)}
            required
            value={values.title}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug (unique)</Label>
          <Input
            autoComplete="off"
            id="slug"
            onChange={(e) => set("slug")(e.target.value)}
            required
            value={values.slug}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <select
            className={SELECT_TRIGGER}
            id="difficulty"
            onChange={(e) =>
              set("difficulty")(e.target.value as CreateProblemBody["difficulty"])
            }
            value={values.difficulty}
          >
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
          </select>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            className="min-h-[120px]"
            id="description"
            onChange={(e) => set("description")(e.target.value)}
            required
            value={values.description}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="constraints">Constraints (optional)</Label>
          <Textarea
            className="min-h-[80px]"
            id="constraints"
            onChange={(e) => set("constraints")(e.target.value)}
            value={values.constraints ?? ""}
          />
        </div>
        <div className="flex items-center gap-2 sm:col-span-2">
          <input
            checked={Boolean(values.isPublished)}
            className="size-4 rounded border"
            id="isPublished"
            onChange={(e) => set("isPublished")(e.target.checked)}
            type="checkbox"
          />
          <Label className="font-normal" htmlFor="isPublished">
            Published
          </Label>
        </div>
        <div className="space-y-2">
          <Label htmlFor="patternSlug">Pattern slug (optional)</Label>
          <Input
            id="patternSlug"
            onChange={(e) => set("patternSlug")(e.target.value)}
            value={values.patternSlug ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="loopStructure">Loop structure (optional)</Label>
          <Input
            id="loopStructure"
            onChange={(e) => set("loopStructure")(e.target.value)}
            value={values.loopStructure ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="skillFocus">Skill focus (optional)</Label>
          <Input
            id="skillFocus"
            onChange={(e) => set("skillFocus")(e.target.value)}
            value={values.skillFocus ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tutorLevel">Tutor level (optional)</Label>
          <Input
            id="tutorLevel"
            onChange={(e) => set("tutorLevel")(e.target.value)}
            value={values.tutorLevel ?? ""}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="visualizationNotes">Visualization notes (optional)</Label>
          <Textarea
            className="min-h-[80px]"
            id="visualizationNotes"
            onChange={(e) => set("visualizationNotes")(e.target.value)}
            value={values.visualizationNotes ?? ""}
          />
        </div>
      </div>

      {message ? (
        <output
          aria-live="polite"
          className={
            status === "error"
              ? "block text-destructive text-sm"
              : "block text-green-600 text-sm dark:text-green-400"
          }
          form="admin-new-problem"
        >
          {message}
        </output>
      ) : null}

      <Button disabled={status === "submitting"} type="submit">
        {status === "submitting" ? "Submitting…" : "Create problem"}
      </Button>
    </form>
  );
}
