"use client";

import { ScrollArea } from "@repo/design-system/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/design-system/components/ui/tabs";
import { useState } from "react";
import type { ProblemTestCaseView } from "@/features/problem-detail/client-test-run";

import { TestcaseInputFields } from "./testcase-field-blocks";

export function TestcasePanel({
  testCaseRows,
}: {
  testCaseRows: ProblemTestCaseView[];
}) {
  const [activeCase, setActiveCase] = useState("0");
  const resolvedActiveCase =
    Number(activeCase) < testCaseRows.length ? activeCase : "0";

  if (testCaseRows.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center p-4">
        <p className="text-muted-foreground text-sm">
          No test cases are available for this problem.
        </p>
      </div>
    );
  }

  return (
    <Tabs
      className="flex min-h-0 flex-1 flex-col overflow-hidden"
      onValueChange={setActiveCase}
      value={resolvedActiveCase}
    >
      <div className="shrink-0 border-border/60 border-b px-3 py-2">
        <TabsList className="h-auto w-full justify-start gap-1 bg-transparent p-0">
          {testCaseRows.map((tc, index) => (
            <TabsTrigger
              className="h-7 shrink-0 rounded-md px-2.5 text-xs data-[state=active]:bg-muted data-[state=active]:shadow-none"
              key={`${index}-${tc.input}`}
              value={String(index)}
            >
              Case {index + 1}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {testCaseRows.map((tc, index) => (
        <TabsContent
          className="mt-0 min-h-0 flex-1 overflow-hidden"
          key={`${index}-${tc.input}`}
          value={String(index)}
        >
          <ScrollArea className="h-full">
            <div className="p-4">
              <TestcaseInputFields input={tc.input} />
            </div>
          </ScrollArea>
        </TabsContent>
      ))}
    </Tabs>
  );
}
