import type { LongestSubstringStep } from "../utils/generate-longest-substring-steps";

type WindowStatsPanelProps = {
  step: LongestSubstringStep;
};

/**
 * [S] Current window, best substring, and best length for the active step.
 */
export function WindowStatsPanel({ step }: WindowStatsPanelProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="text-muted-foreground text-xs uppercase tracking-wide">
          Current Window
        </div>
        <div className="mt-2 font-bold text-2xl">&quot;{step.windowText}&quot;</div>
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="text-muted-foreground text-xs uppercase tracking-wide">
          Best Substring
        </div>
        <div className="mt-2 font-bold text-2xl">&quot;{step.bestText}&quot;</div>
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="text-muted-foreground text-xs uppercase tracking-wide">
          Best Length
        </div>
        <div className="mt-2 font-bold text-2xl">{step.bestLength}</div>
      </div>
    </div>
  );
}
