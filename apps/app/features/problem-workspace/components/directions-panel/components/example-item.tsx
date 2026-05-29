import { asRecord, strField } from "../lib/problem-detail-helpers";

export function ExampleItem({ ex, index }: { ex: unknown; index: number }) {
  const o = asRecord(ex);
  const input = strField(o, "input");
  const output = strField(o, "output");
  const explanation = strField(o, "explanation");
  const showExplanation = explanation !== null && explanation.length > 0;

  return (
    <li className="rounded-md border border-border bg-muted/40 p-3 text-sm">
      <p className="mb-2 font-medium text-muted-foreground text-xs">
        Example {index + 1}
      </p>
      {input !== null ? (
        <div className="space-y-1">
          <span className="text-muted-foreground text-xs">Input</span>
          <pre className="overflow-x-auto rounded bg-background/80 p-2 font-mono text-xs">
            {input}
          </pre>
        </div>
      ) : null}
      {output !== null ? (
        <div className="mt-2 space-y-1">
          <span className="text-muted-foreground text-xs">Output</span>
          <pre className="overflow-x-auto rounded bg-background/80 p-2 font-mono text-xs">
            {output}
          </pre>
        </div>
      ) : null}
      {showExplanation ? (
        <p className="mt-2 text-muted-foreground text-xs">{explanation}</p>
      ) : null}
    </li>
  );
}
