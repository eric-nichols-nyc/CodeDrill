"use client";

import { useMemo, type ReactNode } from "react";
import type { CapturedConsoleLine } from "@/features/problem-detail/client-test-run";

import { formatTestcaseInputFields } from "./utils/format-testcase-input-fields";

function ValueBox({
  children,
  tone = "default",
}: {
  children: string;
  tone?: "default" | "success" | "error";
}) {
  let toneClass = "text-foreground";
  if (tone === "success") {
    toneClass = "text-green-600 dark:text-green-400";
  } else if (tone === "error") {
    toneClass = "text-destructive";
  }

  return (
    <div
      className={`rounded-md border border-border/60 bg-muted/40 px-3 py-2.5 font-mono text-sm leading-relaxed ${toneClass}`}
    >
      {children}
    </div>
  );
}

function SectionLabel({
  children,
  variant = "default",
}: {
  children: string;
  variant?: "default" | "stdout";
}) {
  if (variant === "stdout") {
    return (
      <span className="rounded bg-primary/15 px-1.5 py-0.5 font-medium text-primary text-xs">
        {children}
      </span>
    );
  }

  return (
    <span className="font-medium text-muted-foreground text-xs">{children}</span>
  );
}

function ResultSection({
  label,
  labelVariant = "default",
  children,
}: {
  label: string;
  labelVariant?: "default" | "stdout";
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2">
      <SectionLabel variant={labelVariant}>{label}</SectionLabel>
      {children}
    </section>
  );
}

/** Input fields for a testcase (`nums =`, `target =`, or JSON args). */
export function TestcaseInputFields({ input }: { input: string }) {
  const fields = useMemo(() => formatTestcaseInputFields(input), [input]);

  if (fields.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">No input for this case.</p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {fields.map((field) => (
        <div className="flex flex-col gap-1.5" key={field.label}>
          <span className="font-mono text-muted-foreground text-xs">
            {field.label} =
          </span>
          <ValueBox>{field.value}</ValueBox>
        </div>
      ))}
    </div>
  );
}

function formatStdoutLines(lines: CapturedConsoleLine[]): string {
  if (lines.length === 0) {
    return "";
  }
  return lines.map((line) => line.message).join("\n");
}

/** Four-row result column: Input, Stdout, Output, Expected. */
export function TestResultCaseColumn({
  input,
  stdoutLines,
  output,
  expected,
  passed,
  runtimeError,
}: {
  input: string;
  stdoutLines: CapturedConsoleLine[];
  output: string;
  expected: string;
  passed: boolean;
  runtimeError?: string;
}) {
  const stdout = formatStdoutLines(stdoutLines);
  const outputTone = passed ? "default" : "error";

  let outputDisplay = "—";
  if (runtimeError !== undefined && runtimeError.length > 0) {
    outputDisplay = runtimeError;
  } else if (output.length > 0) {
    outputDisplay = output;
  }

  return (
    <div className="flex flex-col gap-5 p-4">
      <ResultSection label="Input">
        <TestcaseInputFields input={input} />
      </ResultSection>

      <ResultSection label="Stdout" labelVariant="stdout">
        {stdout.length > 0 ? (
          <ValueBox>{stdout}</ValueBox>
        ) : (
          <p className="text-muted-foreground text-sm">No console output.</p>
        )}
      </ResultSection>

      <ResultSection label="Output">
        <ValueBox tone={outputTone}>{outputDisplay}</ValueBox>
      </ResultSection>

      <ResultSection label="Expected">
        <ValueBox tone="success">
          {expected.length > 0 ? expected : "—"}
        </ValueBox>
      </ResultSection>
    </div>
  );
}
