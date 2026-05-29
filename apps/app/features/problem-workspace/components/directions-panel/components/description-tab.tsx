"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/design-system/components/ui/accordion";
import { Badge } from "@repo/design-system/components/ui/badge";
import { cn } from "@repo/design-system/lib/utils";
import { Lightbulb } from "lucide-react";
import { JsonFallback } from "@/features/problem-workspace/editor-panel/components/json-fallback";
import {
  asRecord,
  normalizeDifficultyForDisplay,
  rowKey,
} from "../lib/problem-detail-helpers";
import type {
  ProblemRow,
  ProblemTag,
} from "../lib/problem-detail-types";
import { difficultyTextClass } from "@/features/problems-page/problems-list/utils/difficulty-text-class";
import { ExampleItem } from "./example-item";
import { HintItem } from "./hint-item";

export function DescriptionTab({
  problem,
  p,
  examples,
  hints,
  exampleList,
  hintList,
  showDescription,
  showConstraints,
  showDifficulty,
  tags = [],
}: {
  problem: unknown;
  p: ProblemRow;
  examples: unknown;
  hints: unknown;
  exampleList: unknown[];
  hintList: unknown[];
  showDescription: boolean;
  showConstraints: boolean;
  showDifficulty: boolean;
  tags?: ProblemTag[];
}) {
  const tagList = tags ?? [];
  const showMeta = showDifficulty || tagList.length > 0;
  const difficulty = normalizeDifficultyForDisplay(p.difficulty);

  return (
    <div className="space-y-6 pb-10">
      <header className="space-y-1">
        <h1 className="font-semibold text-xl tracking-tight">
          {p.title ?? "Problem"}
        </h1>
        {showMeta ? (
          <div className="flex flex-wrap items-center gap-2">
            {showDifficulty ? (
              <span
                className={cn("font-medium text-xs", difficultyTextClass(difficulty))}
              >
                {difficulty}
              </span>
            ) : null}
            {tagList.map((tag) => (
              <Badge key={tag.id} variant="outline">
                {tag.name}
              </Badge>
            ))}
          </div>
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
          <Accordion
            className="w-full rounded-lg border border-border"
            collapsible
            type="single"
          >
            {hintList.map((h, i) => {
              const o = asRecord(h);
              return (
                <AccordionItem key={rowKey(o, `hint-${i}`)} value={`hint-${i}`}>
                  <AccordionTrigger className="py-3 text-sm">
                    <span className="flex flex-1 items-center gap-2 text-left">
                      <Lightbulb
                        aria-hidden
                        className="size-4 shrink-0 text-muted-foreground"
                      />
                      <span>Hint {i + 1}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pl-6 text-sm">
                    <HintItem hint={h} variant="accordion" />
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </section>
    </div>
  );
}
