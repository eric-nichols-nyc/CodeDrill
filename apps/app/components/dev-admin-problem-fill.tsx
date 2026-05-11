"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { useCallback } from "react";
import type { CreateProblemBody } from "@/lib/admin/create-problem-schema";
import { getDevSampleProblem } from "@/lib/admin/dev-sample-problem";

type DevAdminProblemFillProps = {
  onFill: (sample: CreateProblemBody) => void;
};

/**
 * Dev-only: applies bundled sample problem data (fresh slug each click).
 */
export function DevAdminProblemFill({ onFill }: DevAdminProblemFillProps) {
  const apply = useCallback(() => {
    onFill(getDevSampleProblem());
  }, [onFill]);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="flex flex-col gap-1 border-muted border-dashed pb-2">
      <p className="text-muted-foreground text-xs">Development only</p>
      <Button
        className="w-fit text-xs"
        onClick={apply}
        size="sm"
        type="button"
        variant="outline"
      >
        Autofill sample problem
      </Button>
    </div>
  );
}
