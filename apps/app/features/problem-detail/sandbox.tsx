import { JsonFallback } from "@/features/problem-detail/json-fallback";
import {
  asRecord,
  strField,
} from "@/features/problem-detail/problem-detail-helpers";

export function Sandbox({ row }: { row: unknown }) {
  const o = asRecord(row);
  const lang = strField(o, "language") ?? "code";
  const code = strField(o, "code");
  const fn = strField(o, "functionName");
  const showFn = fn !== null && fn.length > 0;

  return (
    <div className="overflow-hidden rounded-md border border-border bg-muted/30">
      <div className="flex items-center justify-between border-border border-b bg-muted/60 px-3 py-2">
        <span className="font-mono text-muted-foreground text-xs">{lang}</span>
        {showFn ? (
          <span className="text-muted-foreground text-xs">{fn}</span>
        ) : null}
      </div>
      {code !== null ? (
        <pre className="overflow-x-auto p-3 font-mono text-xs leading-relaxed">
          {code}
        </pre>
      ) : (
        <div className="p-3">
          <JsonFallback data={row} />
        </div>
      )}
    </div>
  );
}
