import { SplitLayout } from "@/components/split-layout";

type ProblemRow = {
  title?: string;
  description?: string;
  constraints?: string | null;
  difficulty?: string;
};

function asRecord(v: unknown): Record<string, unknown> | null {
  if (typeof v !== "object" || v === null) {
    return null;
  }
  return v as Record<string, unknown>;
}

function pickConstraints(raw: unknown): string | null | undefined {
  if (typeof raw === "string") {
    return raw;
  }
  if (raw === null) {
    return null;
  }
  return;
}

function problemRow(problem: unknown): ProblemRow {
  const o = asRecord(problem);
  if (!o) {
    return {};
  }
  return {
    title: typeof o.title === "string" ? o.title : undefined,
    description: typeof o.description === "string" ? o.description : undefined,
    constraints: pickConstraints(o.constraints),
    difficulty: typeof o.difficulty === "string" ? o.difficulty : undefined,
  };
}

function strField(
  o: Record<string, unknown> | null,
  key: string
): string | null {
  if (!o) {
    return null;
  }
  const v = o[key];
  return typeof v === "string" ? v : null;
}

function rowKey(o: Record<string, unknown> | null, fallback: string): string {
  const id = strField(o, "id");
  return id ?? fallback;
}

function JsonFallback({ data }: { data: unknown }) {
  return (
    <pre className="overflow-x-auto rounded-md border border-border bg-muted p-3 text-xs">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

function ExampleItem({ ex, index }: { ex: unknown; index: number }) {
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

function HintItem({ hint }: { hint: unknown }) {
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

function StarterCodeCard({ row }: { row: unknown }) {
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

export function ProblemDetail({
  problem,
  examples,
  hints,
  starterCode,
  learningNotes,
  solutions,
}: {
  problem: unknown;
  examples: unknown;
  hints: unknown;
  starterCode: unknown;
  learningNotes: unknown;
  solutions: unknown;
}) {
  const p = problemRow(problem);
  const exampleList = Array.isArray(examples) ? examples : [];
  const hintList = Array.isArray(hints) ? hints : [];
  const codeRows = Array.isArray(starterCode) ? starterCode : [];
  const showDifficulty = p.difficulty !== undefined && p.difficulty.length > 0;
  const showDescription =
    p.description !== undefined && p.description.length > 0;
  const showConstraints =
    p.constraints !== undefined &&
    p.constraints !== null &&
    p.constraints.length > 0;

  const left = (
    <div className="space-y-6 p-4 pr-3">
      <header className="space-y-1">
        <h1 className="font-semibold text-xl tracking-tight">
          {p.title ?? "Problem"}
        </h1>
        {showDifficulty ? (
          <p className="text-muted-foreground text-xs capitalize">
            {p.difficulty}
          </p>
        ) : null}
      </header>

      <section className="space-y-2">
        <h2 className="font-medium text-muted-foreground text-sm">
          Description
        </h2>
        {showDescription ? (
          <div className="max-w-none whitespace-pre-wrap text-foreground text-sm leading-relaxed">
            {p.description}
          </div>
        ) : (
          <JsonFallback data={problem} />
        )}
        {showConstraints ? (
          <div className="space-y-1">
            <h3 className="font-medium text-muted-foreground text-xs">
              Constraints
            </h3>
            <p className="whitespace-pre-wrap text-muted-foreground text-sm">
              {p.constraints}
            </p>
          </div>
        ) : null}
      </section>

      <section className="space-y-2">
        <h2 className="font-medium text-muted-foreground text-sm">Examples</h2>
        {exampleList.length === 0 ? (
          <JsonFallback data={examples} />
        ) : (
          <ul className="space-y-4">
            {exampleList.map((ex, i) => (
              <ExampleItem
                ex={ex}
                index={i}
                key={rowKey(asRecord(ex), `ex-${i}`)}
              />
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-2">
        <h2 className="font-medium text-muted-foreground text-sm">Hints</h2>
        {hintList.length === 0 ? (
          <JsonFallback data={hints} />
        ) : (
          <ol className="list-decimal space-y-3 pl-4 text-sm">
            {hintList.map((h, i) => (
              <HintItem hint={h} key={rowKey(asRecord(h), `hint-${i}`)} />
            ))}
          </ol>
        )}
      </section>

      <section className="space-y-2 border-border border-t pt-6">
        <h2 className="font-medium text-muted-foreground text-sm">
          Learning notes
        </h2>
        <JsonFallback data={learningNotes} />
      </section>
      <section className="space-y-2">
        <h2 className="font-medium text-muted-foreground text-sm">Solutions</h2>
        <JsonFallback data={solutions} />
      </section>
    </div>
  );

  const starterBody =
    codeRows.length === 0 ? (
      <JsonFallback data={starterCode} />
    ) : (
      <div className="space-y-4">
        {codeRows.map((row, i) => (
          <StarterCodeCard key={rowKey(asRecord(row), `sc-${i}`)} row={row} />
        ))}
      </div>
    );

  const starterPanel = (
    <div className="flex h-full min-h-0 flex-col gap-3 p-4 pl-3">
      <h2 className="shrink-0 font-medium text-muted-foreground text-sm">
        Starter code
      </h2>
      <div className="min-h-0 flex-1 overflow-auto">{starterBody}</div>
    </div>
  );

  const outputPanel = (
    <div className="flex h-full min-h-0 flex-col gap-3 p-4 pl-3">
      <h2 className="shrink-0 font-medium text-muted-foreground text-sm">
        Output
      </h2>
      <div className="min-h-0 flex-1 overflow-auto rounded-md border border-border border-dashed bg-muted/20 p-3">
        <p className="text-muted-foreground text-sm">
          Run results and logs will show here.
        </p>
      </div>
    </div>
  );

  const right = (
    <SplitLayout
      className="min-h-0 flex-1"
      defaultLeftPercent={55}
      left={starterPanel}
      minLeftPx={100}
      minRightPx={96}
      orientation="horizontal"
      right={outputPanel}
    />
  );

  return (
    <SplitLayout
      className="h-full min-h-0"
      defaultLeftPercent={46}
      left={left}
      right={right}
    />
  );
}
