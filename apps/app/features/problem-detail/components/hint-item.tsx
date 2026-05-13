import { JsonFallback } from "@/features/problem-detail/components/json-fallback";
import {
  asRecord,
  strField,
} from "@/features/problem-detail/problem-detail-helpers";

export function HintItem({ hint }: { hint: unknown }) {
  const o = asRecord(hint);
  const title = strField(o, "title");
  const body = strField(o, "body");
  const showTitle = title !== null && title.length > 0;
  const showBody = body !== null && body.length > 0;

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
