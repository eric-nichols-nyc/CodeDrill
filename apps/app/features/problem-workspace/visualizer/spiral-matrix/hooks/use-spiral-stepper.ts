"use client";

import { useMemo, useState } from "react";
import type { SpiralStep } from "../utils/generate-spiral-steps";
import { generateSpiralSteps } from "../utils/generate-spiral-steps";
import { SPIRAL_MATRIX } from "../utils/spiral-matrix-data";

/**
 * [S] Owns step-index navigation state only.
 * [D] Exposes a stable interface; useState is an implementation detail.
 */
export type UseSpiralStepperReturn = {
  step: SpiralStep;
  stepIndex: number;
  totalSteps: number;
  isFirst: boolean;
  isLast: boolean;
  goPrev: () => void;
  goNext: () => void;
  reset: () => void;
};

export function useSpiralStepper(): UseSpiralStepperReturn {
  const steps = useMemo(() => generateSpiralSteps(SPIRAL_MATRIX), []);
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
