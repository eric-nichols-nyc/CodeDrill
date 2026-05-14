"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/design-system/components/ui/accordion";
import { Badge } from "@repo/design-system/components/ui/badge";
import type { AdminProblemDetail as AdminProblemDetailData } from "@/features/admin/lib/problem-form-values";
import {
  isProblemEditorialEmpty,
  parseProblemEditorial,
} from "@/features/problem-detail/parse-editorial";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }
  return value as Record<string, unknown>;
}

function textValue(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : "—";
}

function codeBlock(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : "// empty";
}

export function AdminProblemDetail({
  detail,
}: {
  detail: AdminProblemDetailData;
}) {
  const problem = asRecord(detail.problem);
  const tags = Array.isArray(detail.tags) ? detail.tags : [];
  const examples = Array.isArray(detail.examples) ? detail.examples : [];
  const hints = Array.isArray(detail.hints) ? detail.hints : [];
  const starterCode = Array.isArray(detail.starterCode)
    ? detail.starterCode
    : [];
  const solutions = Array.isArray(detail.solutions) ? detail.solutions : [];
  const testCases = Array.isArray(detail.testCases) ? detail.testCases : [];

  const editorialSummary = parseProblemEditorial(problem?.editorial);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{textValue(problem?.difficulty)}</Badge>
          <Badge variant="outline">
            {problem?.isPublished === true ? "published" : "draft"}
          </Badge>
          <Badge variant="outline">{textValue(problem?.slug)}</Badge>
        </div>
        <div>
          <h2 className="font-semibold text-2xl">
            {textValue(problem?.title)}
          </h2>
          <p className="mt-2 whitespace-pre-wrap text-muted-foreground text-sm">
            {textValue(problem?.description)}
          </p>
        </div>
      </div>

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
        <AccordionItem
          className="rounded-lg border border-border px-4"
          value="basics"
        >
          <AccordionTrigger className="hover:no-underline">
            <span className="font-semibold">Problem basics</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="font-medium text-sm">Constraints</p>
                <p className="mt-1 whitespace-pre-wrap text-muted-foreground text-sm">
                  {textValue(problem?.constraints)}
                </p>
              </div>
              <div>
                <p className="font-medium text-sm">Pattern slug</p>
                <p className="mt-1 text-muted-foreground text-sm">
                  {textValue(problem?.patternSlug)}
                </p>
              </div>
              <div>
                <p className="font-medium text-sm">Loop structure</p>
                <p className="mt-1 text-muted-foreground text-sm">
                  {textValue(problem?.loopStructure)}
                </p>
              </div>
              <div>
                <p className="font-medium text-sm">Skill focus</p>
                <p className="mt-1 text-muted-foreground text-sm">
                  {textValue(problem?.skillFocus)}
                </p>
              </div>
              <div>
                <p className="font-medium text-sm">Tutor level</p>
                <p className="mt-1 text-muted-foreground text-sm">
                  {textValue(problem?.tutorLevel)}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="font-medium text-sm">Editorial</p>
                {isProblemEditorialEmpty(editorialSummary) ? (
                  <p className="mt-1 text-muted-foreground text-sm">—</p>
                ) : (
                  <ul className="mt-1 list-inside list-disc text-muted-foreground text-sm">
                    {editorialSummary.title ? (
                      <li>Title: {editorialSummary.title}</li>
                    ) : null}
                    {editorialSummary.content.trim() ? (
                      <li>
                        Body: HTML ({editorialSummary.content.length} chars)
                      </li>
                    ) : null}
                    {editorialSummary.embeds.length > 0 ? (
                      <li>
                        YouTube IDs:{" "}
                        {editorialSummary.embeds
                          .map((e) => e.videoId)
                          .join(", ")}
                      </li>
                    ) : null}
                  </ul>
                )}
              </div>
              <div className="sm:col-span-2">
                <p className="font-medium text-sm">Visualization notes</p>
                <p className="mt-1 whitespace-pre-wrap text-muted-foreground text-sm">
                  {textValue(problem?.visualizationNotes)}
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          className="rounded-lg border border-border px-4"
          value="starter-code"
        >
          <AccordionTrigger className="hover:no-underline">
            <span className="font-semibold">Starter code</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            {starterCode.length > 0 ? (
              starterCode.map((entry, index) => {
                const row = asRecord(entry);
                return (
                  <div
                    className="rounded-lg border border-border p-4"
                    key={`starter-${index}`}
                  >
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <Badge variant="outline">
                        {textValue(row?.language)}
                      </Badge>
                      <Badge variant="outline">
                        {textValue(row?.functionName)}
                      </Badge>
                    </div>
                    <pre className="overflow-x-auto rounded bg-muted/50 p-3 text-xs">
                      {codeBlock(row?.code)}
                    </pre>
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground text-sm">No starter code.</p>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          className="rounded-lg border border-border px-4"
          value="tags"
        >
          <AccordionTrigger className="hover:no-underline">
            <span className="font-semibold">Tags</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              {tags.length > 0 ? (
                tags.map((tag, index) => {
                  const row = asRecord(tag);
                  return (
                    <Badge key={`tag-${index}`} variant="outline">
                      {textValue(row?.name)}
                    </Badge>
                  );
                })
              ) : (
                <p className="text-muted-foreground text-sm">No tags.</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          className="rounded-lg border border-border px-4"
          value="examples"
        >
          <AccordionTrigger className="hover:no-underline">
            <span className="font-semibold">Examples</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            {examples.length > 0 ? (
              examples.map((example, index) => {
                const row = asRecord(example);
                return (
                  <div
                    className="rounded-lg border border-border p-4"
                    key={`example-${index}`}
                  >
                    <p className="font-medium text-sm">Example {index + 1}</p>
                    <p className="mt-3 font-medium text-xs uppercase tracking-wide">
                      Input
                    </p>
                    <pre className="mt-1 overflow-x-auto rounded bg-muted/50 p-3 text-xs">
                      {codeBlock(row?.input)}
                    </pre>
                    <p className="mt-3 font-medium text-xs uppercase tracking-wide">
                      Output
                    </p>
                    <pre className="mt-1 overflow-x-auto rounded bg-muted/50 p-3 text-xs">
                      {codeBlock(row?.output)}
                    </pre>
                    <p className="mt-3 font-medium text-xs uppercase tracking-wide">
                      Explanation
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-muted-foreground text-sm">
                      {textValue(row?.explanation)}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground text-sm">No examples.</p>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          className="rounded-lg border border-border px-4"
          value="hints"
        >
          <AccordionTrigger className="hover:no-underline">
            <span className="font-semibold">Hints</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            {hints.length > 0 ? (
              hints.map((hint, index) => {
                const row = asRecord(hint);
                return (
                  <div
                    className="rounded-lg border border-border p-4"
                    key={`hint-${index}`}
                  >
                    <p className="font-medium text-sm">
                      {textValue(row?.title)}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-muted-foreground text-sm">
                      {textValue(row?.body)}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground text-sm">No hints.</p>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          className="rounded-lg border border-border px-4"
          value="solutions"
        >
          <AccordionTrigger className="hover:no-underline">
            <span className="font-semibold">Solutions</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            {solutions.length > 0 ? (
              solutions.map((solution, index) => {
                const row = asRecord(solution);
                return (
                  <div
                    className="rounded-lg border border-border p-4"
                    key={`solution-${index}`}
                  >
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <Badge variant="outline">
                        {textValue(row?.language)}
                      </Badge>
                      <Badge variant="outline">
                        {textValue(row?.timeComplexity)}
                      </Badge>
                      <Badge variant="outline">
                        {textValue(row?.spaceComplexity)}
                      </Badge>
                    </div>
                    <pre className="overflow-x-auto rounded bg-muted/50 p-3 text-xs">
                      {codeBlock(row?.code)}
                    </pre>
                    <p className="mt-3 whitespace-pre-wrap text-muted-foreground text-sm">
                      {textValue(row?.explanation)}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground text-sm">No solutions.</p>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          className="rounded-lg border border-border px-4"
          value="test-cases"
        >
          <AccordionTrigger className="hover:no-underline">
            <span className="font-semibold">Test cases</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            {testCases.length > 0 ? (
              testCases.map((testCase, index) => {
                const row = asRecord(testCase);
                return (
                  <div
                    className="rounded-lg border border-border p-4"
                    key={`test-${index}`}
                  >
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <Badge variant="outline">Case {index + 1}</Badge>
                      <Badge variant="outline">
                        {row?.isSample === true ? "sample" : "hidden"}
                      </Badge>
                    </div>
                    <p className="font-medium text-xs uppercase tracking-wide">
                      Input
                    </p>
                    <pre className="mt-1 overflow-x-auto rounded bg-muted/50 p-3 text-xs">
                      {codeBlock(row?.input)}
                    </pre>
                    <p className="mt-3 font-medium text-xs uppercase tracking-wide">
                      Expected output
                    </p>
                    <pre className="mt-1 overflow-x-auto rounded bg-muted/50 p-3 text-xs">
                      {codeBlock(row?.expectedOutput)}
                    </pre>
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground text-sm">No test cases.</p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
