"use client";

import { useMemo, useState } from "react";
import type { LongestSubstringStep } from "../utils/generate-longest-substring-steps";
import { generateLongestSubstringSteps } from "../utils/generate-longest-substring-steps";
import { LONGEST_SUBSTRING_INPUT } from "../utils/longest-substring-data";

/**
 * [S] Owns step-index navigation state only.
 * [D] Exposes a stable interface; useState is an implementation detail.
 */
export type UseLongestSubstringStepperReturn = {
  step: LongestSubstringStep;
  stepIndex: number;
  totalSteps: number;
  isFirst: boolean;
  isLast: boolean;
  goPrev: () => void;
  goNext: () => void;
  reset: () => void;
};

export function useLongestSubstringStepper(): UseLongestSubstringStepperReturn {
  const steps = useMemo(
    () => generateLongestSubstringSteps(LONGEST_SUBSTRING_INPUT),
    []
  );
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex];
  const totalSteps = steps.length;
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;

  return {
    step,
    stepIndex,
    totalSteps,
    isFirst,
    isLast,
    goPrev: () => setStepIndex((current) => Math.max(0, current - 1)),
    goNext: () =>
      setStepIndex((current) => Math.min(totalSteps - 1, current + 1)),
    reset: () => setStepIndex(0),
  };
}
