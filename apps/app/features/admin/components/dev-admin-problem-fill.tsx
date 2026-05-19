"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/design-system/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
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

type DevAdminProblemFillProps = {
  onFill: (sample: CreateProblemBody) => void;
};

/**
 * Dev-only: choose a bundled sample problem (fresh slug on each selection).
 */
export function DevAdminProblemFill({ onFill }: DevAdminProblemFillProps) {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="gap-1.5 text-xs"
          size="sm"
          type="button"
          variant="outline"
        >
          Autofill sample…
          <ChevronDown aria-hidden className="size-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-56">
        <DropdownMenuItem
          className="cursor-pointer text-xs"
          onSelect={() => {
            onFill(getContainsDuplicateProblem());
          }}
        >
          Contains duplicate (LC 217)
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-xs"
          onSelect={() => {
            onFill(getValidAnagramProblem());
          }}
        >
          Valid anagram (LC 242)
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-xs"
          onSelect={() => {
            onFill(getSubarraySumEqualsKProblem());
          }}
        >
          Subarray sum equals K (LC 560)
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-xs"
          onSelect={() => {
            onFill(getTopKFrequentElementsProblem());
          }}
        >
          Top K frequent elements (LC 347)
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-xs"
          onSelect={() => {
            onFill(getValidPalindromeProblem());
          }}
        >
          Valid palindrome (LC 125)
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-xs"
          onSelect={() => {
            onFill(getMinSizeSubarraySumProblem());
          }}
        >
          Min size subarray sum (LC 209)
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-xs"
          onSelect={() => {
            onFill(getThreeSumProblem());
          }}
        >
          3Sum (LC 15)
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-xs"
          onSelect={() => {
            onFill(getContainerWithMostWaterProblem());
          }}
        >
          Container with most water (LC 11)
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-xs"
          onSelect={() => {
            onFill(getPermutationInStringProblem());
          }}
        >
          Permutation in string (LC 567)
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-xs"
          onSelect={() => {
            onFill(getFindAllAnagramsInStringProblem());
          }}
        >
          Find all anagrams in a string (LC 438)
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-xs"
          onSelect={() => {
            onFill(getMaxConsecutiveOnesIIIProblem());
          }}
        >
          Max consecutive ones III (LC 1004)
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-xs"
          onSelect={() => {
            onFill(getLongestRepeatingCharacterReplacementProblem());
          }}
        >
          Longest repeating character replacement (LC 424)
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-xs"
          onSelect={() => {
            onFill(getRotateImageProblem());
          }}
        >
          Rotate image (LC 48)
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-xs"
          onSelect={() => {
            onFill(getSpiralMatrixProblem());
          }}
        >
          Spiral matrix (LC 54)
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-xs"
          onSelect={() => {
            onFill(getSortArrayByIncreasingFrequencyProblem());
          }}
        >
          Sort array by increasing frequency (LC 1636)
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-xs"
          onSelect={() => {
            onFill(getMaxConsecutiveOnesProblem());
          }}
        >
          Max consecutive ones (LC 485)
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-xs"
          onSelect={() => {
            onFill(getRemoveDuplicatesFromSortedArrayProblem());
          }}
        >
          Remove duplicates from sorted array (LC 26)
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-xs"
          onSelect={() => {
            onFill(getCountPairsProblem());
          }}
        >
          Count pairs with sum
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-xs"
          onSelect={() => {
            onFill(getMaxSumSubarrayProblem());
          }}
        >
          Max sum subarray of size k
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-xs"
          onSelect={() => {
            onFill(getHasPairSumProblem());
          }}
        >
          Has pair with sum (sorted)
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-xs"
          onSelect={() => {
            onFill(getReverseVowelsProblem());
          }}
        >
          Reverse vowels of a string (LC 345)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
