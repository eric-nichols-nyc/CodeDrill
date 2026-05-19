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
import { getCountPairsProblem } from "@/features/admin/problems/count-pairs";
import { getHasPairSumProblem } from "@/features/admin/problems/has-pair-sum";
import { getMaxConsecutiveOnesProblem } from "@/features/admin/problems/max-consecutive-ones";
import { getMaxSumSubarrayProblem } from "@/features/admin/problems/max-sum-subarray";
import { getRemoveDuplicatesFromSortedArrayProblem } from "@/features/admin/problems/remove-duplicates-from-sorted-array";
import { getReverseVowelsProblem } from "@/features/admin/problems/reverse-vowels";
import { getSortArrayByIncreasingFrequencyProblem } from "@/features/admin/problems/sort-array-by-increasing-frequency";

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
