"use client";

import { cn } from "@repo/design-system/lib/utils";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const STEPS = [
  "Reading resume…",
  "Parsing job description…",
  "Matching skills to role requirements…",
  "Building your interview plan…",
] as const;

type ScreenGeneratingProps = {
  onComplete: () => void;
};

export function ScreenGenerating({ onComplete }: ScreenGeneratingProps) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const stepInterval = window.setInterval(() => {
      setActiveStep((current) => {
        if (current >= STEPS.length - 1) {
          return current;
        }
        return current + 1;
      });
    }, 650);

    const completeTimeout = window.setTimeout(onComplete, 2600);

    return () => {
      window.clearInterval(stepInterval);
      window.clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center gap-8 px-4 py-12">
      <div className="space-y-2 text-center">
        <Loader2 className="mx-auto size-10 animate-spin text-primary" />
        <h1 className="font-semibold text-2xl tracking-tight">
          Personalizing your interview
        </h1>
        <p className="text-muted-foreground text-sm">
          Analyzing your resume and the job description…
        </p>
      </div>

      <ul className="space-y-3">
        {STEPS.map((step, index) => {
          const isDone = index < activeStep;
          const isActive = index === activeStep;

          return (
            <li
              className={cn(
                "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors",
                isDone && "border-primary/20 bg-primary/5",
                isActive && "border-primary/40 bg-primary/10",
                !isDone && !isActive && "border-border bg-muted/30 text-muted-foreground"
              )}
              key={step}
            >
              {isDone ? (
                <CheckCircle2 className="size-4 shrink-0 text-primary" />
              ) : isActive ? (
                <Loader2 className="size-4 shrink-0 animate-spin text-primary" />
              ) : (
                <span className="size-4 shrink-0 rounded-full border border-muted-foreground/40" />
              )}
              <span className={cn(isActive && "font-medium text-foreground")}>
                {step}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
