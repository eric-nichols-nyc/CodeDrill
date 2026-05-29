import { Button } from "@repo/design-system/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

type VisualizerControlsProps = {
  stepIndex: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
};

/**
 * [S] Prev / next / reset navigation only.
 * [I] No knowledge of step payload — handlers and counts only.
 */
export function VisualizerControls({
  stepIndex,
  totalSteps,
  onPrev,
  onNext,
  onReset,
}: VisualizerControlsProps) {
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;

  return (
    <div className="flex items-center justify-center gap-3">
      <Button disabled={isFirst} onClick={onPrev} variant="outline">
        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
      </Button>
      <Button disabled={isLast} onClick={onNext}>
        Next <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
      <Button onClick={onReset} variant="ghost">
        <RotateCcw className="mr-2 h-4 w-4" /> Reset
      </Button>
    </div>
  );
}
