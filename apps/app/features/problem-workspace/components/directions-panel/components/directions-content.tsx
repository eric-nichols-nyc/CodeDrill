"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/design-system/components/ui/tabs";
import { ProblemVisualizer } from "@/features/problem-workspace/components/visualizer/components/problem-visualizer";
import { DescriptionTab } from "./description-tab";
import { EditorialTab } from "./editorial-tab";
import { ProblemSolutionTab } from "./problem-solution-tab";
import type {
  ProblemEditorial,
  ProblemRow,
  ProblemSolutionRow,
  ProblemTag,
} from "../lib/problem-detail-types";

const panelClass =
  "min-h-0 min-w-0 w-full flex-1 overflow-y-auto pr-4 pt-1 outline-none ring-offset-background focus-visible:outline-none";

export function DirectionsContent({
  p,
  problem,
  examples,
  hints,
  solutions,
  exampleList,
  hintList,
  showDescription,
  showConstraints,
  showDifficulty,
  editorial,
  tags = [],
}: {
  p: ProblemRow;
  problem: unknown;
  examples: unknown;
  hints: unknown;
  solutions: ProblemSolutionRow[];
  exampleList: unknown[];
  hintList: unknown[];
  showDescription: boolean;
  showConstraints: boolean;
  showDifficulty: boolean;
  editorial: ProblemEditorial | null;
  tags?: ProblemTag[];
}) {
  const visualizer = (
    <ProblemVisualizer
      hasVisualizer={p.hasVisualizer === true}
      slug={p.slug ?? ""}
    />
  );

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden p-2">
      <Tabs
        className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 overflow-hidden"
        defaultValue="description"
      >
        <TabsList className="h-auto w-full min-w-0 shrink-0 flex-wrap justify-start gap-1 sm:flex-nowrap">
          <TabsTrigger className="shrink-0" value="description">
            Description
          </TabsTrigger>
          <TabsTrigger className="shrink-0" value="solutions">
            Solutions
          </TabsTrigger>
          <TabsTrigger className="shrink-0" value="editorial">
            Editorial
          </TabsTrigger>
        </TabsList>
        <TabsContent className={panelClass} value="description">
          <DescriptionTab
            exampleList={exampleList}
            examples={examples}
            hintList={hintList}
            hints={hints}
            p={p}
            problem={problem}
            showConstraints={showConstraints}
            showDescription={showDescription}
            showDifficulty={showDifficulty}
            tags={tags}
          />
        </TabsContent>
        <TabsContent className={panelClass} value="solutions">
          <ProblemSolutionTab data={solutions} visualizer={visualizer} />
        </TabsContent>
        <TabsContent className={panelClass} value="editorial">
          <EditorialTab editorial={editorial} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
