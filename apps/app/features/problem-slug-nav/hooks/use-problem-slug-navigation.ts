"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { problemDetailHref } from "@/features/problems-page/problems-list/utils/problem-detail-href";
import {
  getAdjacentSlug,
  getRandomSlug,
} from "@/features/problem-slug-nav/utils/get-adjacent-slug";

export type UseProblemSlugNavigationArgs = {
  catalogSlugs: readonly string[];
  currentSlug: string;
};

export function useProblemSlugNavigation({
  catalogSlugs,
  currentSlug,
}: UseProblemSlugNavigationArgs) {
  const router = useRouter();

  const navigateToSlug = useCallback(
    (slug: string | null) => {
      if (!slug || slug === currentSlug) {
        return;
      }
      router.push(problemDetailHref(slug));
    },
    [currentSlug, router]
  );

  const goToPrevious = useCallback(() => {
    navigateToSlug(getAdjacentSlug(catalogSlugs, currentSlug, "prev"));
  }, [catalogSlugs, currentSlug, navigateToSlug]);

  const goToNext = useCallback(() => {
    navigateToSlug(getAdjacentSlug(catalogSlugs, currentSlug, "next"));
  }, [catalogSlugs, currentSlug, navigateToSlug]);

  const goToRandom = useCallback(() => {
    navigateToSlug(getRandomSlug(catalogSlugs, currentSlug));
  }, [catalogSlugs, currentSlug, navigateToSlug]);

  const canNavigate = catalogSlugs.length > 1;

  return {
    canNavigate,
    goToPrevious,
    goToNext,
    goToRandom,
  };
}
