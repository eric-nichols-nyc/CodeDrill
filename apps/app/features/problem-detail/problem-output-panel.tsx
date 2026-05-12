"use client";

import { Badge } from "@repo/design-system/components/ui/badge";
import { ScrollArea } from "@repo/design-system/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/design-system/components/ui/tabs";

type ConsoleEntry = {
  id: string;
  level: "info" | "success";
  message: string;
  createdAt: string;
};

type StarterCodeRow = {
  key: string;
  language: string;
  functionName: string | null;
};

export function ProblemOutputPanel({
  activeTab,
  consoleEntries,
  isBusy,
  lastAction,
  onTabChange,
  rows,
}: {
  activeTab: string;
  consoleEntries: ConsoleEntry[];
  isBusy: boolean;
  lastAction: "run" | "submit" | null;
  onTabChange: (value: string) => void;
  rows: StarterCodeRow[];
}) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3 p-4 pl-3">
      <div className="flex shrink-0 items-center justify-between gap-3">
        <h2 className="font-medium text-muted-foreground text-sm">Output</h2>
        <div className="flex items-center gap-2">
          {lastAction ? <Badge variant="outline">Last action: {lastAction}</Badge> : null}
          {isBusy ? <Badge>Working</Badge> : null}
        </div>
      </div>

      <Tabs
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
        onValueChange={onTabChange}
        value={activeTab}
      >
        <TabsList className="h-auto w-full justify-start gap-1">
          <TabsTrigger className="shrink-0" value="console">
            Console
          </TabsTrigger>
          <TabsTrigger className="shrink-0" value="testcases">
            Testcases
          </TabsTrigger>
          <TabsTrigger className="shrink-0" value="results">
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent
          className="min-h-0 flex-1 overflow-hidden rounded-md border border-border bg-muted/20"
          value="console"
        >
          <ScrollArea className="h-full">
            <div className="space-y-3 p-3 font-mono text-xs leading-6">
              {consoleEntries.length > 0 ? (
                consoleEntries.map((entry) => (
                  <div
                    className="rounded-md border border-border/70 bg-background/70 px-3 py-2"
                    key={entry.id}
                  >
                    <div className="mb-1 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                      <span>{entry.level}</span>
                      <span>{entry.createdAt}</span>
                    </div>
                    <p>{entry.message}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">
                  Console output will appear here when you run code.
                </p>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent
          className="min-h-0 flex-1 overflow-hidden rounded-md border border-border bg-muted/20"
          value="testcases"
        >
          <ScrollArea className="h-full">
            <div className="space-y-3 p-3 text-sm">
              {rows.length > 0 ? (
                rows.map((row, index) => (
                  <div
                    className="rounded-md border border-border/70 bg-background/70 px-3 py-3"
                    key={row.key}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">Starter {index + 1}</Badge>
                      <Badge variant="outline">{row.language}</Badge>
                    </div>
                    <p className="mt-2 text-muted-foreground text-sm">
                      {row.functionName
                        ? `Ready to validate function ${row.functionName}.`
                        : "Ready to validate this starter file once testcases are wired."}
                    </p>
                  </div>
                ))
              ) : (
                <p className="p-3 text-muted-foreground text-sm">
                  No starter files are available for testcase preview yet.
                </p>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent
          className="min-h-0 flex-1 overflow-hidden rounded-md border border-border bg-muted/20"
          value="results"
        >
          <ScrollArea className="h-full">
            <div className="space-y-3 p-3 text-sm">
              <div className="rounded-md border border-border/70 bg-background/70 px-3 py-3">
                <p className="font-medium">Workspace status</p>
                <p className="mt-2 text-muted-foreground">
                  {lastAction === "submit"
                    ? "Submission UI is ready to connect to your judge."
                    : lastAction === "run"
                      ? "Run UI is ready to connect to your local test execution path."
                      : "Run or submit to populate this panel with real results."}
                </p>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
