"use client";

import { ProblemSlugNavHeader } from "@/features/problem-workspace/components/problem-slug-nav-header";
import { useProblemSlugNavigation } from "@/features/problem-slug-nav/hooks/use-problem-slug-navigation";
import type { Problem } from "@/features/problems-page/lib/types";

export type ProblemSlugNavHeaderConnectedProps = {
  title: string;
  currentSlug: string;
  catalogSlugs: readonly string[];
  problems: Problem[];
  fetchOk: boolean;
  fetchStatus: number;
};

export function ProblemSlugNavHeaderConnected({
  title,
  currentSlug,
  catalogSlugs,
  problems,
  fetchOk,
  fetchStatus,
}: ProblemSlugNavHeaderConnectedProps) {
  const { canNavigate, goToPrevious, goToNext, goToRandom } =
    useProblemSlugNavigation({ catalogSlugs, currentSlug });

  return (
    <ProblemSlugNavHeader
      canNavigate={canNavigate}
      currentSlug={currentSlug}
      fetchOk={fetchOk}
      fetchStatus={fetchStatus}
      onNext={goToNext}
      onPrevious={goToPrevious}
      onRandom={goToRandom}
      problems={problems}
      title={title}
    />
  );
}
