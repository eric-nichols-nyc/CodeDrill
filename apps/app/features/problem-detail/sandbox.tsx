import { cn } from "@repo/design-system/lib/utils";
import { JsonFallback } from "@/features/problem-detail/json-fallback";
import {
  asRecord,
  strField,
} from "@/features/problem-detail/problem-detail-helpers";

export function Sandbox({
  row,
  fillHeight = false,
}: {
  row: unknown;
  /** When true, stretches to fill a flex parent (e.g. single starter file in the panel). */
  fillHeight?: boolean;
}) {
  const o = asRecord(row);
  const lang = strField(o, "language") ?? "code";
  const code = strField(o, "code");
  const fn = strField(o, "functionName");
  const showFn = fn !== null && fn.length > 0;

  const bodyClass = cn(
    "overflow-auto p-3 font-mono text-xs leading-relaxed",
    fillHeight ? "min-h-0 flex-1" : ""
  );

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-md border border-border bg-muted/30",
        fillHeight ? "h-full min-h-0 flex-1" : ""
      )}
    >
      <div className="flex shrink-0 items-center justify-between border-border border-b bg-muted/60 px-3 py-2">
        <span className="font-mono text-muted-foreground text-xs">{lang}</span>
        {showFn ? (
          <span className="text-muted-foreground text-xs">{fn}</span>
        ) : null}
      </div>
      {code !== null ? (
        <pre className={cn(bodyClass, "overflow-x-auto")}>{code}</pre>
      ) : (
        <div className={cn(bodyClass, "min-h-0")}>
          <JsonFallback data={row} />
        </div>
      )}
    </div>
  );
}
