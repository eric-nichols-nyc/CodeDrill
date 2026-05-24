import { JsonFallback } from "@/features/problem-workspace/components/json-fallback";
import {
  asRecord,
  strField,
} from "@/features/problem-workspace/problem-detail-helpers";

type HintItemProps = {
  hint: unknown;
  /** In accordion panels the row label is "Hint n"; title (if any) is shown inside the panel. */
  variant?: "list" | "accordion";
};

export function HintItem({ hint, variant = "list" }: HintItemProps) {
  const o = asRecord(hint);
  const title = strField(o, "title");
  const body = strField(o, "body");
  const showTitle = title !== null && title.length > 0;
  const showBody = body !== null && body.length > 0;

  if (variant === "accordion") {
    return (
      <div className="space-y-2">
        {showTitle ? (
          <p className="font-medium text-foreground text-sm">{title}</p>
        ) : null}
        {showBody ? (
          <p className="whitespace-pre-wrap text-muted-foreground">{body}</p>
        ) : null}
        {showBody ? null : <JsonFallback data={hint} />}
      </div>
    );
  }

  return (
    <li>
      {showTitle ? <p className="font-medium">{title}</p> : null}
      {showBody ? (
        <p className="whitespace-pre-wrap text-muted-foreground">{body}</p>
      ) : null}
      {showBody ? null : <JsonFallback data={hint} />}
    </li>
  );
}
