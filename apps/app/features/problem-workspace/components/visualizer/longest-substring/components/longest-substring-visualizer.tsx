"use client";

import { Badge } from "@repo/design-system/components/ui/badge";
import { Card, CardContent } from "@repo/design-system/components/ui/card";
import { CodePanel } from "../../spiral-matrix/components/code-panel";
import { StepExplanationPanel } from "../../spiral-matrix/components/step-explanation-panel";
import { VisualizerControls } from "../../spiral-matrix/components/visualizer-controls";
import { useLongestSubstringStepper } from "../hooks/use-longest-substring-stepper";
import {
  LONGEST_SUBSTRING_CODE_LINES,
  LONGEST_SUBSTRING_INPUT,
} from "../utils/longest-substring-data";
import { SeenPanel } from "./seen-panel";
import { StringWindow } from "./string-window";
import { WindowStatsPanel } from "./window-stats-panel";

function formatPhase(phase: string) {
  return phase.replace(/-/g, " ");
}

/**
 * [S] Composition root — wires hook output to leaf components.
 * [D] Depends on useLongestSubstringStepper; no useState or algorithm here.
 */
export function LongestSubstringVisualizer() {
  const { step, stepIndex, totalSteps, goPrev, goNext, reset } =
    useLongestSubstringStepper();

  return (
    <div className="space-y-6 text-foreground">
      <Card>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-xl">Code Trace</h2>
              <p className="text-muted-foreground text-sm">
                The highlighted line matches the current visual step.
              </p>
            </div>
            <Badge variant="secondary">Phase: {formatPhase(step.phase)}</Badge>
          </div>
          <CodePanel
            activeLine={step.activeLine}
            lines={LONGEST_SUBSTRING_CODE_LINES}
          />
          <StepExplanationPanel
            explanation={step.explanation}
            stepIndex={stepIndex}
            totalSteps={totalSteps}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-6">
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <div className="mb-3 font-bold text-muted-foreground text-sm uppercase tracking-wide">
              Input String
            </div>
            <StringWindow input={LONGEST_SUBSTRING_INPUT} step={step} />
          </div>

          <VisualizerControls
            onNext={goNext}
            onPrev={goPrev}
            onReset={reset}
            stepIndex={stepIndex}
            totalSteps={totalSteps}
          />

          <WindowStatsPanel step={step} />

          <div>
            <h2 className="mb-3 font-bold text-muted-foreground text-sm uppercase tracking-wide">
              Seen Set
            </h2>
            <SeenPanel seen={step.seen} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
