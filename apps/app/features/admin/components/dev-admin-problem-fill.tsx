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
import { getDevSampleGroupAnagramsProblem } from "@/features/admin/problems/dev-sample-group-anagrams";
import { getDevSampleLongestSubstringTwoDistinctProblem } from "@/features/admin/problems/dev-sample-longest-substring-two-distinct";
import { getDevSampleLongestUniqueSubstringProblem } from "@/features/admin/problems/dev-sample-longest-unique-substring";
import { getDevSampleProblem } from "@/features/admin/problems/move-zeros";

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
            onFill(getDevSampleProblem());
          }}
        >
          Move Zeros
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-xs"
          onSelect={() => {
            onFill(getDevSampleLongestUniqueSubstringProblem());
          }}
        >
          Longest unique substring (sliding window)
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-xs"
          onSelect={() => {
            onFill(getDevSampleLongestSubstringTwoDistinctProblem());
          }}
        >
          Longest substring, at most 2 distinct (LC 159)
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-xs"
          onSelect={() => {
            onFill(getDevSampleGroupAnagramsProblem());
          }}
        >
          Group anagrams (hash map)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
