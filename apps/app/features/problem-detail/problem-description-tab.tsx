import { ExampleItem } from "@/features/problem-detail/example-item";
import { HintItem } from "@/features/problem-detail/hint-item";
import { JsonFallback } from "@/features/problem-detail/json-fallback";
import {
  asRecord,
  rowKey,
} from "@/features/problem-detail/problem-detail-helpers";
import type { ProblemRow } from "@/features/problem-detail/problem-detail-types";

export function ProblemDescriptionTab({
  problem,
  p,
  examples,
  hints,
  learningNotes,
  exampleList,
  hintList,
  showDescription,
  showConstraints,
  showDifficulty,
}: {
  problem: unknown;
  p: ProblemRow;
  examples: unknown;
  hints: unknown;
  learningNotes: unknown;
  exampleList: unknown[];
  hintList: unknown[];
  showDescription: boolean;
  showConstraints: boolean;
  showDifficulty: boolean;
}) {
  return (
    <div className="space-y-6">
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

      <section className="space-y-2 border-border border-t pt-2">
        <h2 className="font-medium text-muted-foreground text-sm">
          Learning notes
        </h2>
        <JsonFallback data={learningNotes} />
      </section>
    </div>
  );
}
