import type { Bounds } from "../utils/generate-spiral-steps";

/**
 * [S] Displays boundary pointers (top, bottom, left, right).
 * [I] Receives Bounds only.
 */
export function BoundsPanel({ bounds }: { bounds: Bounds }) {
  return (
    <div className="grid grid-cols-4 gap-2 text-center text-sm">
      {Object.entries(bounds).map(([key, value]) => (
        <div className="rounded-xl border border-border bg-card p-3" key={key}>
          <div className="text-muted-foreground text-xs uppercase tracking-wide">
            {key}
          </div>
          <div className="font-bold text-lg">{value}</div>
        </div>
      ))}
    </div>
  );
}
