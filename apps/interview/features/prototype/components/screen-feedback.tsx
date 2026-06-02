"use client";

import {
  mockInterview,
  mockQuestions,
} from "@/features/prototype/data/mock-data";
import { Button } from "@repo/design-system/components/ui/button";
import { cn } from "@repo/design-system/lib/utils";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
} from "lucide-react";

type ScoreRingProps = {
  score: number;
};

function scoreRingColor(score: number) {
  if (score >= 85) {
    return "#10b981";
  }
  if (score >= 70) {
    return "#6366f1";
  }
  return "#f59e0b";
}

function ScoreRing({ score }: ScoreRingProps) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex size-28 items-center justify-center">
      <svg className="-rotate-90 size-28" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          fill="none"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          className="text-muted"
        />
        <circle
          cx="50"
          cy="50"
          fill="none"
          r={radius}
          stroke={scoreRingColor(score)}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth="8"
          style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-bold text-2xl text-foreground">{score}</span>
        <span className="text-muted-foreground text-xs">/ 100</span>
      </div>
    </div>
  );
}

function ScoreLabel({ score }: { score: number }) {
  if (score >= 85) {
    return <span className="font-semibold text-emerald-600">Excellent</span>;
  }
  if (score >= 70) {
    return <span className="font-semibold text-indigo-600">Good</span>;
  }
  return <span className="font-semibold text-amber-600">Needs Work</span>;
}

function scoreSummary(score: number) {
  if (score >= 85) {
    return "Strong answer — well structured and thorough.";
  }
  if (score >= 70) {
    return "Good foundation, with some gaps to address.";
  }
  return "Consider reviewing this topic before the real interview.";
}

type ScreenFeedbackProps = {
  questionIndex: number;
  onNext: () => void;
  isLast: boolean;
};

export function ScreenFeedback({
  questionIndex,
  onNext,
  isLast,
}: ScreenFeedbackProps) {
  const question = mockQuestions[questionIndex];
  const { feedback } = question;
  const nextLabel = isLast ? "View Final Report" : "Next Question";

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 border-b bg-card/80 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <p className="font-medium text-muted-foreground text-sm">
            Q{questionIndex + 1} Feedback · {question.topic}
          </p>
          <p className="text-muted-foreground text-xs">
            {questionIndex + 1} of {mockInterview.totalQuestions}
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-8">
        <div className="flex items-center gap-6 rounded-3xl border bg-card p-6 shadow-sm">
          <ScoreRing score={feedback.score} />
          <div>
            <p className="mb-1 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Your Score
            </p>
            <div className="font-bold text-2xl">
              <ScoreLabel score={feedback.score} />
            </div>
            <p className="mt-1 text-muted-foreground text-sm">
              {scoreSummary(feedback.score)}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border bg-muted/40 p-4">
          <p className="mb-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
            The Question
          </p>
          <p className="text-foreground text-sm leading-relaxed">
            {question.question}
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="flex items-center gap-2.5 border-b bg-emerald-500/10 px-5 py-3.5">
            <CheckCircle2 className="size-[18px] text-emerald-600" />
            <p className="font-semibold text-emerald-800 text-sm dark:text-emerald-300">
              What You Did Well
            </p>
          </div>
          <ul className="space-y-3 px-5 py-4">
            {feedback.strengths.map((strength) => (
              <li className="flex items-start gap-3" key={strength}>
                <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
                  <div className="size-2 rounded-full bg-emerald-500" />
                </div>
                <p className="text-foreground text-sm leading-relaxed">
                  {strength}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="flex items-center gap-2.5 border-b bg-amber-500/10 px-5 py-3.5">
            <AlertTriangle className="size-[18px] text-amber-600" />
            <p className="font-semibold text-amber-800 text-sm dark:text-amber-300">
              Missing Concepts
            </p>
          </div>
          <ul className="space-y-3 px-5 py-4">
            {feedback.missingConcepts.map((concept) => (
              <li className="flex items-start gap-3" key={concept}>
                <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950">
                  <div className="size-2 rounded-full bg-amber-500" />
                </div>
                <p className="text-foreground text-sm leading-relaxed">
                  {concept}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="flex items-center gap-2.5 border-b bg-blue-500/10 px-5 py-3.5">
            <Lightbulb className="size-[18px] text-blue-600" />
            <p className="font-semibold text-blue-800 text-sm dark:text-blue-300">
              Model Answer
            </p>
          </div>
          <div className="px-5 py-4">
            <p
              className={cn(
                "whitespace-pre-wrap rounded-xl bg-muted/60 p-4 text-foreground text-xs leading-relaxed",
                feedback.suggestedAnswer.includes("```") && "font-mono"
              )}
            >
              {feedback.suggestedAnswer}
            </p>
          </div>
        </div>

        <Button
          className="group h-[52px] w-full rounded-2xl text-base shadow-lg"
          onClick={onNext}
          size="lg"
        >
          {nextLabel}
          <ChevronRight className="ml-1.5 size-5 transition-transform group-hover:translate-x-0.5" />
        </Button>

        <div className="h-4" />
      </main>
    </div>
  );
}
