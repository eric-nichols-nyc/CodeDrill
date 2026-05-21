"use client";

import { ProblemSlugNavHeader } from "@/features/problem-detail/components/problem-slug-nav-header";
import { useProblemSlugNavigation } from "@/features/problem-slug-nav/hooks/use-problem-slug-navigation";

export type ProblemSlugNavHeaderConnectedProps = {
  title: string;
  currentSlug: string;
  catalogSlugs: readonly string[];
};

export function ProblemSlugNavHeaderConnected({
  title,
  currentSlug,
  catalogSlugs,
}: ProblemSlugNavHeaderConnectedProps) {
  const { canNavigate, goToPrevious, goToNext, goToRandom } =
    useProblemSlugNavigation({ catalogSlugs, currentSlug });

  return (
    <ProblemSlugNavHeader
      canNavigate={canNavigate}
      onNext={goToNext}
      onPrevious={goToPrevious}
      onRandom={goToRandom}
      title={title}
    />
  );
}
