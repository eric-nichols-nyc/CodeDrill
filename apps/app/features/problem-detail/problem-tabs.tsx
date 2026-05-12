"use client";

import type { ReactNode } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/design-system/components/ui/tabs";
import { cn } from "@repo/design-system/lib/utils";
import { ProblemSolution } from "@/features/problem-detail/problem-solution";
import type { ProblemSolutionRow } from "@/features/problem-detail/problem-detail-types";

export type ProblemTabsProps = {
  description: ReactNode;
  solutions: ProblemSolutionRow[];
  editorial: ReactNode;
  className?: string;
};

const panelClass =
  "min-h-0 flex-1 overflow-y-auto pr-1 pt-1 outline-none ring-offset-background focus-visible:outline-none";

export function ProblemTabs({
  description,
  solutions,
  editorial,
  className,
}: ProblemTabsProps) {
  return (
    <Tabs
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-hidden",
        className
      )}
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
        {description}
      </TabsContent>
      <TabsContent className={panelClass} value="solutions">
        <ProblemSolution data={solutions} />
      </TabsContent>
      <TabsContent className={panelClass} value="editorial">
        {editorial}
      </TabsContent>
    </Tabs>
  );
}
