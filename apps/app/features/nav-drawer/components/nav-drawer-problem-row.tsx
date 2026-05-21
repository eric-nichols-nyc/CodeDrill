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
};

export function NavDrawerProblemRow({
  problem,
  isActive,
}: NavDrawerProblemRowProps) {
  return (
    <SheetClose asChild>
      <Link
        className={cn(
          "flex items-center justify-between gap-3 border-border border-b px-4 py-2.5 text-sm transition-colors last:border-b-0 hover:bg-accent/50",
          isActive &&
            "border-l-2 border-l-primary bg-accent/60 pl-[calc(1rem-2px)]"
        )}
        href={problemDetailHref(problem.slug)}
      >
        <span
          className={cn(
            "min-w-0 truncate font-medium",
            isActive ? "text-foreground" : "text-foreground/90"
          )}
        >
          {problem.id}. {problem.title}
        </span>
        <span
          className={cn(
            "shrink-0 font-medium text-xs",
            difficultyTextClass(problem.difficulty)
          )}
        >
          {problem.difficulty}
        </span>
      </Link>
    </SheetClose>
  );
}
