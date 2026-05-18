"use client";

import { cn } from "@repo/design-system/lib/utils";
import { FileText, Lock } from "lucide-react";
import Link from "next/link";
import { ProblemFavoriteButton } from "@/features/problem-progress/components/problem-favorite-button";
import type { Problem } from "../../lib/types";
import { problemsListGridClassName } from "../lib/layout";
import { difficultyTextClass } from "../utils/difficulty-text-class";
import { problemDetailHref } from "../utils/problem-detail-href";
import { ProblemStatusIcon } from "./problem-status-icon";

export type ProblemListRowProps = {
  problem: Problem;
  stripeIndex: number;
};

export function ProblemListRow({ problem, stripeIndex }: ProblemListRowProps) {
  const href = problemDetailHref(problem.slug);

  const stripe =
    stripeIndex % 2 === 0
      ? "bg-muted/[0.02] hover:bg-muted/10 dark:bg-white/[0.035] dark:hover:bg-white/[0.06]"
      : "bg-muted/12 hover:bg-muted/20 dark:bg-muted/16 dark:hover:bg-muted/24";

  return (
    <div
      className={cn(
        problemsListGridClassName,
        "py-2.5 font-semibold text-base text-foreground",
        stripe
      )}
    >
      <Link
        className="contents cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        href={href}
      >
        <span className="justify-self-start">
          <ProblemStatusIcon status={problem.status} />
        </span>
        <span className="text-foreground tabular-nums">{problem.id}</span>
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-foreground transition-colors hover:text-primary">
              {problem.title}
            </span>
            {problem.isPremium ? (
              <Lock className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
            ) : null}
          </div>
        </div>
        <span className="justify-self-start">
          {problem.status === "solved" ? (
            <FileText aria-hidden className="h-4 w-4 text-muted-foreground" />
          ) : null}
        </span>
        <span className="justify-self-start">
          <span
            className={cn(
              "font-semibold",
              difficultyTextClass(problem.difficulty)
            )}
          >
            {problem.difficulty}
          </span>
        </span>
      </Link>
      <span className="justify-self-end">
        {problem.problemId ? (
          <ProblemFavoriteButton problemId={problem.problemId} />
        ) : null}
      </span>
    </div>
  );
}
