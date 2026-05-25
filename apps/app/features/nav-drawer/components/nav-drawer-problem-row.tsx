"use client";

import { SheetClose } from "@repo/design-system/components/ui/sheet";
import { cn } from "@repo/design-system/lib/utils";
import Link from "next/link";
import type { Problem } from "@/features/problems-page/lib/types";
import { difficultyTextClass } from "@/features/problems-page/problems-list/utils/difficulty-text-class";
import { problemDetailHref } from "@/features/problems-page/problems-list/utils/problem-detail-href";

export type NavDrawerProblemRowProps = {
  problem: Problem;
  isActive: boolean;
  stripeIndex: number;
};

export function NavDrawerProblemRow({
  problem,
  isActive,
  stripeIndex,
}: NavDrawerProblemRowProps) {
  const stripe =
    stripeIndex % 2 === 0
      ? "bg-muted/[0.02] hover:bg-muted/10 dark:bg-white/[0.035] dark:hover:bg-white/[0.06]"
      : "bg-muted/12 hover:bg-muted/20 dark:bg-muted/16 dark:hover:bg-muted/24";

  return (
    <SheetClose asChild>
      <Link
        className={cn(
          "flex items-center justify-between gap-3 border-border border-b px-4 py-2.5 text-sm transition-colors last:border-b-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isActive
            ? "bg-white text-neutral-900 hover:bg-white/90"
            : cn(stripe, "text-foreground/90 hover:text-foreground")
        )}
        href={problemDetailHref(problem.slug)}
      >
        <span className="min-w-0 truncate font-semibold">
          {problem.id}. {problem.title}
        </span>
        <span
          className={cn(
            "shrink-0 font-semibold text-xs",
            difficultyTextClass(problem.difficulty)
          )}
        >
          {problem.difficulty}
        </span>
      </Link>
    </SheetClose>
  );
}
