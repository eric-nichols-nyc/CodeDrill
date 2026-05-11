import type { CreateProblemBody } from "@/lib/admin/create-problem-schema";

/** Deterministic copy for local testing; slug gets a unique suffix when applied. */
export function getDevSampleProblem(): CreateProblemBody {
  const suffix = Date.now();
  return {
    title: "Two Sum (dev sample)",
    slug: `two-sum-dev-${suffix}`,
    difficulty: "easy",
    description:
      "Given an integer array nums and an integer target, return the indices of the two distinct elements such that they add up to target. If there is exactly one valid answer, return it. You may not use the same element twice.",
    constraints:
      "2 <= nums.length <= 10^4. -10^9 <= nums[i] <= 10^9. -10^9 <= target <= 10^9. Exactly one valid answer exists.",
    isPublished: false,
    patternSlug: "hash-map",
    loopStructure: "single-pass-with-map",
    skillFocus: "Store complement target - nums[i] in a map keyed by value.",
    tutorLevel: "beginner",
    visualizationNotes:
      "Walk the array once; for each value v, check whether (target - v) was seen. If yes, return both indices.",
  };
}
