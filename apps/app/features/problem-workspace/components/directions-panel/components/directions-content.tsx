"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/design-system/components/ui/tabs";
import { DescriptionTab } from "./description-tab";
import { EditorialTab } from "./editorial-tab";
import { ProblemSolutionTab } from "./problem-solution-tab";

const panelClass =
  "min-h-0 min-w-0 w-full flex-1 overflow-y-auto pr-4 pt-1 outline-none ring-offset-background focus-visible:outline-none";

export function DirectionsContent() {
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
          <DescriptionTab />
        </TabsContent>
        <TabsContent className={panelClass} value="solutions">
          <ProblemSolutionTab />
        </TabsContent>
        <TabsContent className={panelClass} value="editorial">
          <EditorialTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
