"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/design-system/components/ui/accordion";
import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import { Textarea } from "@repo/design-system/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { AdminEditorialQuill } from "@/features/admin/components/admin-editorial-quill";
import { DevAdminProblemFill } from "@/features/admin/components/dev-admin-problem-fill";
import { GenerateProblemFromPrompt } from "@/features/admin/components/generate-problem-from-prompt";
import {
  buildProblemPayload,
  formatSubmitError,
} from "@/features/admin/lib/build-problem-payload";
import type { CreateProblemBody } from "@/features/admin/lib/create-problem-schema";
import { normalizeCreateProblemBody } from "@/features/admin/lib/problem-form-values";

type StarterCodeRow = CreateProblemBody["starterCode"][number];
type ExampleRow = NonNullable<CreateProblemBody["examples"]>[number];
type HintRow = NonNullable<CreateProblemBody["hints"]>[number];
type SolutionRow = NonNullable<CreateProblemBody["solutions"]>[number];
type TestCaseRow = NonNullable<CreateProblemBody["testCases"]>[number];
type EditorialModel = NonNullable<CreateProblemBody["editorial"]>;

const SELECT_TRIGGER =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30";

const STARTER_LANGUAGES = ["javascript", "typescript", "python"] as const;

function createYoutubeEmbedRow(): EditorialModel["embeds"][number] {
  return { type: "youtube", videoId: "" };
}

function createStarterCodeRow(language = "javascript"): StarterCodeRow {
  return {
    language,
    code: "",
    functionName: "",
  };
}

function createExampleRow(): ExampleRow {
  return {
    input: "",
    output: "",
    explanation: "",
  };
}

function createHintRow(): HintRow {
  return {
    title: "",
    body: "",
  };
}

function createSolutionRow(): SolutionRow {
  return {
    language: "javascript",
    code: "",
    explanation: "",
    timeComplexity: "",
    spaceComplexity: "",
  };
}

function createTestCaseRow(): TestCaseRow {
  return {
    input: "",
    expectedOutput: "",
    isSample: false,
  };
}

function createEmptyForm(): CreateProblemBody {
  return normalizeCreateProblemBody({
    starterCode: [createStarterCodeRow()],
  });
}

function replaceAt<T>(items: T[], index: number, nextItem: T): T[] {
  return items.map((item, itemIndex) =>
    itemIndex === index ? nextItem : item
  );
}

function removeAt<T>(items: T[], index: number): T[] {
  return items.filter((_, itemIndex) => itemIndex !== index);
}

function nextStarterLanguage(rows: StarterCodeRow[]): string {
  const used = new Set(rows.map((row) => row.language.trim().toLowerCase()));
  return (
    STARTER_LANGUAGES.find((language) => !used.has(language)) ?? "javascript"
  );
}

function hasDuplicateStarterLanguages(rows: StarterCodeRow[]): boolean {
  const seen = new Set<string>();

  for (const row of rows) {
    const language = row.language.trim().toLowerCase();
    if (!language) {
      continue;
    }
    if (seen.has(language)) {
      return true;
    }
    seen.add(language);
  }

  return false;
}

function SectionHeader({
  title,
  description,
  onAdd,
  addLabel,
}: {
  title: string;
  description: string;
  onAdd: () => void;
  addLabel: string;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div className="space-y-1">
        <h3 className="font-medium text-base">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <Button onClick={onAdd} size="sm" type="button" variant="outline">
        <Plus />
        {addLabel}
      </Button>
    </div>
  );
}

function FieldLabel({
  htmlFor,
  required = false,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <Label htmlFor={htmlFor}>
      {children}
      {required ? <span className="ml-1 text-destructive">*</span> : null}
    </Label>
  );
}

function AccordionSection({
  value,
  title,
  description,
  children,
}: {
  value: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <AccordionItem
      className="rounded-lg border border-border px-4"
      value={value}
    >
      <AccordionTrigger className="hover:no-underline">
        <div className="space-y-1">
          <h2 className="font-semibold text-base">{title}</h2>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </AccordionItem>
  );
}

export function NewProblemForm({
  initialValues,
  method = "POST",
  endpoint = "/api/admin/problems",
  submitLabel,
  successMessage,
  onSubmitted,
  showDevFill = method === "POST",
}: {
  initialValues?: CreateProblemBody;
  method?: "POST" | "PUT";
  endpoint?: string;
  submitLabel?: string;
  successMessage?: string;
  onSubmitted?: (
    body: unknown,
    values: CreateProblemBody
  ) => void | Promise<void>;
  showDevFill?: boolean;
}) {
  const router = useRouter();
  const [values, setValues] = useState<CreateProblemBody>(() =>
    normalizeCreateProblemBody(initialValues ?? createEmptyForm())
  );
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);
  const resolvedSubmitLabel =
    submitLabel ?? (method === "PUT" ? "Update problem" : "Create problem");
  const resolvedSuccessMessage =
    successMessage ??
    (method === "PUT" ? "Problem updated." : "Problem created.");

  useEffect(() => {
    setValues(normalizeCreateProblemBody(initialValues ?? createEmptyForm()));
    setMessage(null);
    setStatus("idle");
  }, [initialValues]);

  const set = (key: keyof CreateProblemBody) => (v: string | boolean) => {
    setValues((prev) => ({ ...prev, [key]: v }));
  };

  const updateTag = (index: number, value: string) => {
    setValues((prev) => ({
      ...prev,
      tags: replaceAt(prev.tags ?? [], index, value),
    }));
  };

  const addTag = () => {
    setValues((prev) => ({
      ...prev,
      tags: [...(prev.tags ?? []), ""],
    }));
  };

  const removeTag = (index: number) => {
    setValues((prev) => ({
      ...prev,
      tags: removeAt(prev.tags ?? [], index),
    }));
  };

  const updateStarterCodeField =
    (index: number, key: keyof StarterCodeRow) => (value: string) => {
      setValues((prev) => {
        const current = prev.starterCode[index] ?? createStarterCodeRow();
        const nextRow: StarterCodeRow =
          key === "language"
            ? { ...current, language: value }
            : key === "code"
              ? { ...current, code: value }
              : { ...current, functionName: value };

        return {
          ...prev,
          starterCode: replaceAt(prev.starterCode, index, nextRow),
        };
      });
    };

  const addStarterCodeRow = () => {
    setValues((prev) => ({
      ...prev,
      starterCode: [
        ...prev.starterCode,
        createStarterCodeRow(nextStarterLanguage(prev.starterCode)),
      ],
    }));
  };

  const removeStarterCodeRow = (index: number) => {
    setValues((prev) => ({
      ...prev,
      starterCode:
        prev.starterCode.length > 1
          ? removeAt(prev.starterCode, index)
          : prev.starterCode,
    }));
  };

  const updateExampleField =
    (index: number, key: keyof ExampleRow) => (value: string) => {
      setValues((prev) => {
        const current = prev.examples?.[index] ?? createExampleRow();
        const nextRow: ExampleRow =
          key === "input"
            ? { ...current, input: value }
            : key === "output"
              ? { ...current, output: value }
              : { ...current, explanation: value };

        return {
          ...prev,
          examples: replaceAt(prev.examples ?? [], index, nextRow),
        };
      });
    };

  const addExampleRow = () => {
    setValues((prev) => ({
      ...prev,
      examples: [...(prev.examples ?? []), createExampleRow()],
    }));
  };

  const removeExampleRow = (index: number) => {
    setValues((prev) => ({
      ...prev,
      examples: removeAt(prev.examples ?? [], index),
    }));
  };

  const updateHintField =
    (index: number, key: keyof HintRow) => (value: string) => {
      setValues((prev) => {
        const current = prev.hints?.[index] ?? createHintRow();
        const nextRow: HintRow =
          key === "title"
            ? { ...current, title: value }
            : { ...current, body: value };

        return {
          ...prev,
          hints: replaceAt(prev.hints ?? [], index, nextRow),
        };
      });
    };

  const addHintRow = () => {
    setValues((prev) => ({
      ...prev,
      hints: [...(prev.hints ?? []), createHintRow()],
    }));
  };

  const removeHintRow = (index: number) => {
    setValues((prev) => ({
      ...prev,
      hints: removeAt(prev.hints ?? [], index),
    }));
  };

  const updateSolutionField =
    (index: number, key: keyof SolutionRow) => (value: string) => {
      setValues((prev) => {
        const current = prev.solutions?.[index] ?? createSolutionRow();
        const nextRow: SolutionRow =
          key === "language"
            ? { ...current, language: value }
            : key === "code"
              ? { ...current, code: value }
              : key === "explanation"
                ? { ...current, explanation: value }
                : key === "timeComplexity"
                  ? { ...current, timeComplexity: value }
                  : { ...current, spaceComplexity: value };

        return {
          ...prev,
          solutions: replaceAt(prev.solutions ?? [], index, nextRow),
        };
      });
    };

  const addSolutionRow = () => {
    setValues((prev) => ({
      ...prev,
      solutions: [...(prev.solutions ?? []), createSolutionRow()],
    }));
  };

  const removeSolutionRow = (index: number) => {
    setValues((prev) => ({
      ...prev,
      solutions: removeAt(prev.solutions ?? [], index),
    }));
  };

  const updateTestCaseField =
    (index: number, key: keyof TestCaseRow) => (value: string | boolean) => {
      setValues((prev) => {
        const current = prev.testCases?.[index] ?? createTestCaseRow();
        const nextRow: TestCaseRow =
          key === "input"
            ? { ...current, input: String(value) }
            : key === "expectedOutput"
              ? { ...current, expectedOutput: String(value) }
              : { ...current, isSample: Boolean(value) };

        return {
          ...prev,
          testCases: replaceAt(prev.testCases ?? [], index, nextRow),
        };
      });
    };

  const addTestCaseRow = () => {
    setValues((prev) => ({
      ...prev,
      testCases: [...(prev.testCases ?? []), createTestCaseRow()],
    }));
  };

  const removeTestCaseRow = (index: number) => {
    setValues((prev) => ({
      ...prev,
      testCases: removeAt(prev.testCases ?? [], index),
    }));
  };

  const updateEditorialTitle = (title: string) => {
    setValues((prev) => {
      const ed = prev.editorial ?? { content: "", embeds: [] };
      const base = { content: ed.content, embeds: ed.embeds };
      return {
        ...prev,
        editorial: title.trim() ? { ...base, title: title.trim() } : base,
      };
    });
  };

  const updateEditorialContent = (content: string) => {
    setValues((prev) => {
      const ed = prev.editorial ?? { content: "", embeds: [] };
      return { ...prev, editorial: { ...ed, content } };
    });
  };

  const updateYoutubeEmbed = (index: number, videoId: string) => {
    setValues((prev) => {
      const ed = prev.editorial ?? { content: "", embeds: [] };
      const embeds = [...ed.embeds];
      const row = embeds[index];
      if (!row) {
        return prev;
      }
      embeds[index] = { type: "youtube", videoId };
      return { ...prev, editorial: { ...ed, embeds } };
    });
  };

  const addYoutubeEmbed = () => {
    setValues((prev) => {
      const ed = prev.editorial ?? { content: "", embeds: [] };
      return {
        ...prev,
        editorial: {
          ...ed,
          embeds: [...ed.embeds, createYoutubeEmbedRow()],
        },
      };
    });
  };

  const removeYoutubeEmbed = (index: number) => {
    setValues((prev) => {
      const ed = prev.editorial ?? { content: "", embeds: [] };
      return {
        ...prev,
        editorial: { ...ed, embeds: removeAt(ed.embeds, index) },
      };
    });
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

    if (hasDuplicateStarterLanguages(values.starterCode)) {
      setStatus("error");
      setMessage("Each starter code entry must use a unique language.");
      return;
    }

    const res = await fetch(endpoint, {
      method,
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
    setMessage(resolvedSuccessMessage);
    if (method === "POST") {
      setValues(createEmptyForm());
    }
    await onSubmitted?.(body, values);
    router.refresh();
  }

  return (
    <form
      className="flex flex-col gap-6"
      id="admin-new-problem"
      onSubmit={onSubmit}
    >
      {showDevFill ? (
        <div className="flex flex-col gap-6 border border-muted border-dashed px-2 py-3">
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground text-xs">Development only</p>
            <DevAdminProblemFill onFill={handleDevFill} />
          </div>
          <div className="flex flex-col gap-2 border-muted border-t border-dashed pt-4">
            <p className="text-muted-foreground text-xs">
              OpenAI — set <code className="text-foreground">OPENAI_API_KEY</code> in{" "}
              <code className="text-foreground">apps/app</code> env
            </p>
            <GenerateProblemFromPrompt onFilled={handleDevFill} />
          </div>
        </div>
      ) : null}

      <Accordion
        className="space-y-4"
        defaultValue={[
          "basics",
          "starter-code",
          "tags",
          "examples",
          "hints",
          "solutions",
          "test-cases",
        ]}
        type="multiple"
      >
        <AccordionSection
          description="Core metadata and descriptive fields for the problem."
          title="Problem basics"
          value="basics"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <FieldLabel htmlFor="title" required>
                Title
              </FieldLabel>
              <Input
                autoComplete="off"
                id="title"
                onChange={(e) => set("title")(e.target.value)}
                required
                value={values.title}
              />
            </div>
            <div className="space-y-2">
              <FieldLabel htmlFor="slug" required>
                Slug (unique)
              </FieldLabel>
              <Input
                autoComplete="off"
                id="slug"
                onChange={(e) => set("slug")(e.target.value)}
                required
                value={values.slug}
              />
            </div>
            <div className="space-y-2">
              <FieldLabel htmlFor="difficulty" required>
                Difficulty
              </FieldLabel>
              <select
                className={SELECT_TRIGGER}
                id="difficulty"
                onChange={(e) =>
                  set("difficulty")(
                    e.target.value as CreateProblemBody["difficulty"]
                  )
                }
                value={values.difficulty}
              >
                <option value="easy">easy</option>
                <option value="medium">medium</option>
                <option value="hard">hard</option>
              </select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <FieldLabel htmlFor="description" required>
                Description
              </FieldLabel>
              <Textarea
                className="min-h-[140px]"
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
              <Label htmlFor="visualizationNotes">
                Visualization notes (optional)
              </Label>
              <Textarea
                className="min-h-[80px]"
                id="visualizationNotes"
                onChange={(e) => set("visualizationNotes")(e.target.value)}
                value={values.visualizationNotes ?? ""}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="editorialTitle">Editorial title (optional)</Label>
              <Input
                autoComplete="off"
                id="editorialTitle"
                onChange={(e) => updateEditorialTitle(e.target.value)}
                placeholder="e.g. Intuition & approach"
                value={values.editorial?.title ?? ""}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Editorial body</Label>
              <AdminEditorialQuill
                key={values.slug || "new-problem-editorial"}
                onChange={updateEditorialContent}
                value={values.editorial?.content ?? ""}
              />
              <p className="text-muted-foreground text-xs">
                Rich text is stored as HTML; YouTube players use the video IDs
                below. All of this is saved as JSON in the editorial column.
              </p>
            </div>
            <div className="space-y-3 sm:col-span-2">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <p className="font-medium text-sm">YouTube embeds</p>
                  <p className="text-muted-foreground text-xs">
                    Video ID only (from youtube.com/watch?v=…).
                  </p>
                </div>
                <Button
                  onClick={addYoutubeEmbed}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  <Plus />
                  Add video
                </Button>
              </div>
              <div className="space-y-3">
                {(values.editorial?.embeds ?? []).length === 0 ? (
                  <p className="text-muted-foreground text-sm">No videos.</p>
                ) : (
                  (values.editorial?.embeds ?? []).map((row, index) => (
                    <div
                      className="flex flex-wrap items-end gap-2 rounded-md border border-border p-3"
                      key={`yt-${values.slug}-${String(index)}`}
                    >
                      <div className="min-w-[200px] flex-1 space-y-1">
                        <Label htmlFor={`youtube-id-${String(index)}`}>
                          Video ID {index + 1}
                        </Label>
                        <Input
                          autoComplete="off"
                          id={`youtube-id-${String(index)}`}
                          onChange={(e) =>
                            updateYoutubeEmbed(index, e.target.value)
                          }
                          placeholder="dQw4w9WgXcQ"
                          value={row.videoId}
                        />
                      </div>
                      <Button
                        onClick={() => removeYoutubeEmbed(index)}
                        size="sm"
                        type="button"
                        variant="ghost"
                      >
                        <Trash2 />
                        Remove
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </AccordionSection>

        <AccordionSection
          description="Add one starter template per supported language. At least one is required."
          title="Starter code"
          value="starter-code"
        >
          <SectionHeader
            addLabel="Add starter"
            description="These populate the editor for each language option."
            onAdd={addStarterCodeRow}
            title="Language templates"
          />
          <div className="space-y-4">
            {values.starterCode.map((row, index) => (
              <div
                className="space-y-4 rounded-lg border border-border p-4"
                key={`starter-${index}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-medium text-sm">Starter {index + 1}</p>
                  <Button
                    disabled={values.starterCode.length === 1}
                    onClick={() => removeStarterCodeRow(index)}
                    size="sm"
                    type="button"
                    variant="ghost"
                  >
                    <Trash2 />
                    Remove
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <FieldLabel htmlFor={`starter-language-${index}`} required>
                      Language
                    </FieldLabel>
                    <select
                      className={SELECT_TRIGGER}
                      id={`starter-language-${index}`}
                      onChange={(e) =>
                        updateStarterCodeField(
                          index,
                          "language"
                        )(e.target.value)
                      }
                      value={row.language}
                    >
                      <option value="javascript">javascript</option>
                      <option value="typescript">typescript</option>
                      <option value="python">python</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <FieldLabel htmlFor={`starter-function-${index}`}>
                      Function name (optional)
                    </FieldLabel>
                    <Input
                      id={`starter-function-${index}`}
                      onChange={(e) =>
                        updateStarterCodeField(
                          index,
                          "functionName"
                        )(e.target.value)
                      }
                      value={row.functionName ?? ""}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <FieldLabel htmlFor={`starter-code-${index}`} required>
                      Code
                    </FieldLabel>
                    <Textarea
                      className="min-h-[220px] font-mono text-sm"
                      id={`starter-code-${index}`}
                      onChange={(e) =>
                        updateStarterCodeField(index, "code")(e.target.value)
                      }
                      required
                      value={row.code}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AccordionSection>

        <AccordionSection
          description="Keep these short and normalized. The backend will dedupe and slugify them."
          title="Tags"
          value="tags"
        >
          <SectionHeader
            addLabel="Add tag"
            description="Examples: array, hash-table, two-pointers."
            onAdd={addTag}
            title="Problem tags"
          />
          <div className="space-y-3">
            {values.tags && values.tags.length > 0 ? (
              values.tags.map((tag, index) => (
                <div className="flex items-center gap-2" key={`tag-${index}`}>
                  <Input
                    onChange={(e) => updateTag(index, e.target.value)}
                    placeholder="two-pointers"
                    value={tag}
                  />
                  <Button
                    onClick={() => removeTag(index)}
                    size="icon-sm"
                    type="button"
                    variant="ghost"
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No tags yet.</p>
            )}
          </div>
        </AccordionSection>

        <AccordionSection
          description="Public examples shown in the problem statement."
          title="Examples"
          value="examples"
        >
          <SectionHeader
            addLabel="Add example"
            description="Each example needs input and output. Explanation is optional."
            onAdd={addExampleRow}
            title="Statement examples"
          />
          <div className="space-y-4">
            {values.examples && values.examples.length > 0 ? (
              values.examples.map((row, index) => (
                <div
                  className="space-y-4 rounded-lg border border-border p-4"
                  key={`example-${index}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-medium text-sm">Example {index + 1}</p>
                    <Button
                      onClick={() => removeExampleRow(index)}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      <Trash2 />
                      Remove
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`example-input-${index}`}>Input</Label>
                      <Textarea
                        className="min-h-[110px] font-mono text-sm"
                        id={`example-input-${index}`}
                        onChange={(e) =>
                          updateExampleField(index, "input")(e.target.value)
                        }
                        value={row.input}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`example-output-${index}`}>Output</Label>
                      <Textarea
                        className="min-h-[110px] font-mono text-sm"
                        id={`example-output-${index}`}
                        onChange={(e) =>
                          updateExampleField(index, "output")(e.target.value)
                        }
                        value={row.output}
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor={`example-explanation-${index}`}>
                        Explanation (optional)
                      </Label>
                      <Textarea
                        className="min-h-[90px]"
                        id={`example-explanation-${index}`}
                        onChange={(e) =>
                          updateExampleField(
                            index,
                            "explanation"
                          )(e.target.value)
                        }
                        value={row.explanation ?? ""}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No examples yet.</p>
            )}
          </div>
        </AccordionSection>

        <AccordionSection
          description="Add progressive hints that nudge the user without giving away the full answer."
          title="Hints"
          value="hints"
        >
          <SectionHeader
            addLabel="Add hint"
            description="Hints are optional, but great for guided practice."
            onAdd={addHintRow}
            title="Hint list"
          />
          <div className="space-y-4">
            {values.hints && values.hints.length > 0 ? (
              values.hints.map((row, index) => (
                <div
                  className="space-y-4 rounded-lg border border-border p-4"
                  key={`hint-${index}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-medium text-sm">Hint {index + 1}</p>
                    <Button
                      onClick={() => removeHintRow(index)}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      <Trash2 />
                      Remove
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`hint-title-${index}`}>
                        Title (optional)
                      </Label>
                      <Input
                        id={`hint-title-${index}`}
                        onChange={(e) =>
                          updateHintField(index, "title")(e.target.value)
                        }
                        value={row.title ?? ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`hint-body-${index}`}>Body</Label>
                      <Textarea
                        className="min-h-[100px]"
                        id={`hint-body-${index}`}
                        onChange={(e) =>
                          updateHintField(index, "body")(e.target.value)
                        }
                        value={row.body}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No hints yet.</p>
            )}
          </div>
        </AccordionSection>

        <AccordionSection
          description="Reference solutions and explanations for editorial content."
          title="Solutions"
          value="solutions"
        >
          <SectionHeader
            addLabel="Add solution"
            description="You can add one solution per language."
            onAdd={addSolutionRow}
            title="Reference solutions"
          />
          <div className="space-y-4">
            {values.solutions && values.solutions.length > 0 ? (
              values.solutions.map((row, index) => (
                <div
                  className="space-y-4 rounded-lg border border-border p-4"
                  key={`solution-${index}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-medium text-sm">Solution {index + 1}</p>
                    <Button
                      onClick={() => removeSolutionRow(index)}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      <Trash2 />
                      Remove
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`solution-language-${index}`}>
                        Language
                      </Label>
                      <select
                        className={SELECT_TRIGGER}
                        id={`solution-language-${index}`}
                        onChange={(e) =>
                          updateSolutionField(index, "language")(e.target.value)
                        }
                        value={row.language}
                      >
                        <option value="javascript">javascript</option>
                        <option value="typescript">typescript</option>
                        <option value="python">python</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`solution-time-${index}`}>
                        Time complexity (optional)
                      </Label>
                      <Input
                        id={`solution-time-${index}`}
                        onChange={(e) =>
                          updateSolutionField(
                            index,
                            "timeComplexity"
                          )(e.target.value)
                        }
                        placeholder="O(n)"
                        value={row.timeComplexity ?? ""}
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor={`solution-space-${index}`}>
                        Space complexity (optional)
                      </Label>
                      <Input
                        id={`solution-space-${index}`}
                        onChange={(e) =>
                          updateSolutionField(
                            index,
                            "spaceComplexity"
                          )(e.target.value)
                        }
                        placeholder="O(1)"
                        value={row.spaceComplexity ?? ""}
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor={`solution-code-${index}`}>Code</Label>
                      <Textarea
                        className="min-h-[220px] font-mono text-sm"
                        id={`solution-code-${index}`}
                        onChange={(e) =>
                          updateSolutionField(index, "code")(e.target.value)
                        }
                        value={row.code}
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor={`solution-explanation-${index}`}>
                        Explanation (optional)
                      </Label>
                      <Textarea
                        className="min-h-[110px]"
                        id={`solution-explanation-${index}`}
                        onChange={(e) =>
                          updateSolutionField(
                            index,
                            "explanation"
                          )(e.target.value)
                        }
                        value={row.explanation ?? ""}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No solutions yet.</p>
            )}
          </div>
        </AccordionSection>

        <AccordionSection
          description="Hidden and sample testcases that power Run and Submit."
          title="Test cases"
          value="test-cases"
        >
          <SectionHeader
            addLabel="Add testcase"
            description="Mark sample cases so they can appear in the public run UI."
            onAdd={addTestCaseRow}
            title="Judge inputs"
          />
          <div className="space-y-4">
            {values.testCases && values.testCases.length > 0 ? (
              values.testCases.map((row, index) => (
                <div
                  className="space-y-4 rounded-lg border border-border p-4"
                  key={`testcase-${index}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-medium text-sm">Testcase {index + 1}</p>
                    <Button
                      onClick={() => removeTestCaseRow(index)}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      <Trash2 />
                      Remove
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`testcase-input-${index}`}>Input</Label>
                      <Textarea
                        className="min-h-[110px] font-mono text-sm"
                        id={`testcase-input-${index}`}
                        onChange={(e) =>
                          updateTestCaseField(index, "input")(e.target.value)
                        }
                        value={row.input}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`testcase-output-${index}`}>
                        Expected output
                      </Label>
                      <Textarea
                        className="min-h-[110px] font-mono text-sm"
                        id={`testcase-output-${index}`}
                        onChange={(e) =>
                          updateTestCaseField(
                            index,
                            "expectedOutput"
                          )(e.target.value)
                        }
                        value={row.expectedOutput}
                      />
                    </div>
                    <div className="flex items-center gap-2 sm:col-span-2">
                      <input
                        checked={Boolean(row.isSample)}
                        className="size-4 rounded border"
                        id={`testcase-sample-${index}`}
                        onChange={(e) =>
                          updateTestCaseField(
                            index,
                            "isSample"
                          )(e.target.checked)
                        }
                        type="checkbox"
                      />
                      <Label
                        className="font-normal"
                        htmlFor={`testcase-sample-${index}`}
                      >
                        Sample testcase
                      </Label>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No testcases yet.</p>
            )}
          </div>
        </AccordionSection>
      </Accordion>

      <footer className="-mx-6 sticky bottom-0 z-30 flex shrink-0 flex-col gap-3 border-border border-t bg-background/95 px-6 pt-4 pb-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
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

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-muted-foreground text-sm">
            <span className="text-destructive">*</span> Required fields
          </p>
          <Button disabled={status === "submitting"} type="submit">
            {status === "submitting" ? "Submitting..." : resolvedSubmitLabel}
          </Button>
        </div>
      </footer>
    </form>
  );
}
