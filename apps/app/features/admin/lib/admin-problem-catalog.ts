import type { CreateProblemBody } from "@/features/admin/lib/create-problem-schema";
import { getContainerWithMostWaterProblem } from "@/features/admin/problems/container-with-most-water";
import { getContainsDuplicateProblem } from "@/features/admin/problems/contains-duplicate";
import { getCountPairsProblem } from "@/features/admin/problems/count-pairs";
import { getFindAllAnagramsInStringProblem } from "@/features/admin/problems/find-all-anagrams-in-string";
import { getHasPairSumProblem } from "@/features/admin/problems/has-pair-sum";
import { getLongestRepeatingCharacterReplacementProblem } from "@/features/admin/problems/longest-repeating-character-replacement";
import { getMaxConsecutiveOnesIIIProblem } from "@/features/admin/problems/max-consecutive-ones-iii";
import { getMaxConsecutiveOnesProblem } from "@/features/admin/problems/max-consecutive-ones";
import { getMaxSumSubarrayProblem } from "@/features/admin/problems/max-sum-subarray";
import { getMinSizeSubarraySumProblem } from "@/features/admin/problems/min-size-subarray-sum";
import { getPermutationInStringProblem } from "@/features/admin/problems/permutation-in-string";
import { getRemoveDuplicatesFromSortedArrayProblem } from "@/features/admin/problems/remove-duplicates-from-sorted-array";
import { getReverseVowelsProblem } from "@/features/admin/problems/reverse-vowels";
import { getRotateImageProblem } from "@/features/admin/problems/rotate-image";
import { getSortArrayByIncreasingFrequencyProblem } from "@/features/admin/problems/sort-array-by-increasing-frequency";
import { getSpiralMatrixProblem } from "@/features/admin/problems/spiral-matrix";
import { getSubarraySumEqualsKProblem } from "@/features/admin/problems/subarray-sum-equals-k";
import { getThreeSumProblem } from "@/features/admin/problems/three-sum";
import { getTopKFrequentElementsProblem } from "@/features/admin/problems/top-k-frequent-elements";
import { getValidAnagramProblem } from "@/features/admin/problems/valid-anagram";
import { getValidPalindromeProblem } from "@/features/admin/problems/valid-palindrome";

export type AdminProblemCatalogDifficulty = "easy" | "medium" | "hard";

export type AdminProblemCatalogEntry = {
  catalogKey: string;
  title: string;
  difficulty: AdminProblemCatalogDifficulty;
  patternSlug?: string;
  leetcodeNumber?: number;
  getPayload: () => CreateProblemBody;
};

export const ADMIN_PROBLEM_CATALOG: readonly AdminProblemCatalogEntry[] = [
  {
    catalogKey: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "easy",
    patternSlug: "hash-set",
    leetcodeNumber: 217,
    getPayload: getContainsDuplicateProblem,
  },
  {
    catalogKey: "valid-anagram",
    title: "Valid Anagram",
    difficulty: "easy",
    patternSlug: "hash-map",
    leetcodeNumber: 242,
    getPayload: getValidAnagramProblem,
  },
  {
    catalogKey: "subarray-sum-equals-k",
    title: "Subarray Sum Equals K",
    difficulty: "medium",
    patternSlug: "hash-map",
    leetcodeNumber: 560,
    getPayload: getSubarraySumEqualsKProblem,
  },
  {
    catalogKey: "top-k-frequent-elements",
    title: "Top K Frequent Elements",
    difficulty: "medium",
    patternSlug: "hash-map",
    leetcodeNumber: 347,
    getPayload: getTopKFrequentElementsProblem,
  },
  {
    catalogKey: "valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "easy",
    patternSlug: "two-pointers",
    leetcodeNumber: 125,
    getPayload: getValidPalindromeProblem,
  },
  {
    catalogKey: "min-size-subarray-sum",
    title: "Minimum Size Subarray Sum",
    difficulty: "medium",
    patternSlug: "sliding-window",
    leetcodeNumber: 209,
    getPayload: getMinSizeSubarraySumProblem,
  },
  {
    catalogKey: "three-sum",
    title: "3Sum",
    difficulty: "medium",
    patternSlug: "two-pointers",
    leetcodeNumber: 15,
    getPayload: getThreeSumProblem,
  },
  {
    catalogKey: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "medium",
    patternSlug: "two-pointers",
    leetcodeNumber: 11,
    getPayload: getContainerWithMostWaterProblem,
  },
  {
    catalogKey: "permutation-in-string",
    title: "Permutation in String",
    difficulty: "medium",
    patternSlug: "sliding-window",
    leetcodeNumber: 567,
    getPayload: getPermutationInStringProblem,
  },
  {
    catalogKey: "find-all-anagrams-in-string",
    title: "Find All Anagrams in a String",
    difficulty: "medium",
    patternSlug: "sliding-window",
    leetcodeNumber: 438,
    getPayload: getFindAllAnagramsInStringProblem,
  },
  {
    catalogKey: "max-consecutive-ones-iii",
    title: "Max Consecutive Ones III",
    difficulty: "medium",
    patternSlug: "sliding-window",
    leetcodeNumber: 1004,
    getPayload: getMaxConsecutiveOnesIIIProblem,
  },
  {
    catalogKey: "longest-repeating-character-replacement",
    title: "Longest Repeating Character Replacement",
    difficulty: "medium",
    patternSlug: "sliding-window",
    leetcodeNumber: 424,
    getPayload: getLongestRepeatingCharacterReplacementProblem,
  },
  {
    catalogKey: "rotate-image",
    title: "Rotate Image",
    difficulty: "medium",
    patternSlug: "array",
    leetcodeNumber: 48,
    getPayload: getRotateImageProblem,
  },
  {
    catalogKey: "spiral-matrix",
    title: "Spiral Matrix",
    difficulty: "medium",
    patternSlug: "array",
    leetcodeNumber: 54,
    getPayload: getSpiralMatrixProblem,
  },
  {
    catalogKey: "sort-array-by-increasing-frequency",
    title: "Sort Array by Increasing Frequency",
    difficulty: "easy",
    patternSlug: "hash-map",
    leetcodeNumber: 1636,
    getPayload: getSortArrayByIncreasingFrequencyProblem,
  },
  {
    catalogKey: "max-consecutive-ones",
    title: "Max Consecutive Ones",
    difficulty: "easy",
    patternSlug: "sliding-window",
    leetcodeNumber: 485,
    getPayload: getMaxConsecutiveOnesProblem,
  },
  {
    catalogKey: "remove-duplicates-from-sorted-array",
    title: "Remove Duplicates from Sorted Array",
    difficulty: "easy",
    patternSlug: "two-pointers",
    leetcodeNumber: 26,
    getPayload: getRemoveDuplicatesFromSortedArrayProblem,
  },
  {
    catalogKey: "count-pairs-with-sum",
    title: "Count Pairs With Sum",
    difficulty: "easy",
    patternSlug: "hash-map",
    getPayload: getCountPairsProblem,
  },
  {
    catalogKey: "max-sum-subarray-of-size-k",
    title: "Maximum Sum Subarray of Size K",
    difficulty: "easy",
    patternSlug: "sliding-window",
    getPayload: getMaxSumSubarrayProblem,
  },
  {
    catalogKey: "has-pair-with-sum",
    title: "Has Pair With Sum",
    difficulty: "easy",
    patternSlug: "two-pointers",
    getPayload: getHasPairSumProblem,
  },
  {
    catalogKey: "reverse-vowels",
    title: "Reverse Vowels of a String",
    difficulty: "easy",
    patternSlug: "two-pointers",
    leetcodeNumber: 345,
    getPayload: getReverseVowelsProblem,
  },
] as const;

export function findCatalogEntry(
  catalogKey: string
): AdminProblemCatalogEntry | undefined {
  return ADMIN_PROBLEM_CATALOG.find((entry) => entry.catalogKey === catalogKey);
}
