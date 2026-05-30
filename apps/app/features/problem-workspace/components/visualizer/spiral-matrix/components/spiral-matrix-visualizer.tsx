"use client";

import { Badge } from "@repo/design-system/components/ui/badge";
import { Card, CardContent } from "@repo/design-system/components/ui/card";
import { useSpiralStepper } from "../hooks/use-spiral-stepper";
import { SPIRAL_CODE_LINES, SPIRAL_MATRIX } from "../utils/spiral-matrix-data";
import { BoundsPanel } from "./bounds-panel";
import { CodePanel } from "./code-panel";
import { MatrixGrid } from "./matrix-grid";
import { ResultArray } from "./result-array";
import { StepExplanationPanel } from "./step-explanation-panel";
import { VisualizerControls } from "./visualizer-controls";

/**
 * [S] Composition root — wires hook output to leaf components.
 * [D] Depends on useSpiralStepper; no useState or algorithm here.
 */
export function SpiralMatrixVisualizer() {
  const {
    step,
    stepIndex,
    totalSteps,
    goPrev,
    goNext,
    reset,
  } = useSpiralStepper();

  return (
    <div className="space-y-6 text-foreground">
      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-xl">Code Trace</h2>
              <p className="text-muted-foreground text-sm">
                The highlighted line matches the current visual step.
              </p>
            </div>
            <Badge variant="secondary">Direction: {step.direction}</Badge>
          </div>
          <CodePanel activeLine={step.activeLine} lines={SPIRAL_CODE_LINES} />

          <StepExplanationPanel
            explanation={step.explanation}
            stepIndex={stepIndex}
            totalSteps={totalSteps}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <MatrixGrid
              currentCol={step.col}
              currentRow={step.row}
              matrix={SPIRAL_MATRIX}
              visited={step.visited}
            />
          </div>

          <VisualizerControls
            onNext={goNext}
            onPrev={goPrev}
            onReset={reset}
            stepIndex={stepIndex}
            totalSteps={totalSteps}
          />

          <div>
            <h2 className="mb-3 font-bold text-muted-foreground text-sm uppercase tracking-wide">
              Result
            </h2>
            <ResultArray result={step.result} />
          </div>

          <div>
            <h2 className="mb-3 font-bold text-muted-foreground text-sm uppercase tracking-wide">
              Current Bounds
            </h2>
            <BoundsPanel bounds={step.bounds} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
