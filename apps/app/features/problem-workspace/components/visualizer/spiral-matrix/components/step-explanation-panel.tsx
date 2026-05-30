type StepExplanationPanelProps = {
  stepIndex: number;
  totalSteps: number;
  explanation: string;
};

/**
 * [S] Current step counter and explanation text.
 * [I] Receives step index, total count, and explanation only.
 */
export function StepExplanationPanel({
  stepIndex,
  totalSteps,
  explanation,
}: StepExplanationPanelProps) {
  return (
    <div className="rounded-xl border border-border bg-muted/40 p-4">
      <div className="mb-2 font-semibold text-muted-foreground text-xs">
        Step {stepIndex + 1} of {totalSteps}
      </div>
      <p className="font-medium text-sm">{explanation}</p>
    </div>
  );
}
