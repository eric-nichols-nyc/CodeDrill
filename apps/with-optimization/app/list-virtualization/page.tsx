"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { ScrollText } from "lucide-react";
import { useMemo } from "react";
import { List, type RowComponentProps } from "react-window";

const ITEM_COUNT = 10_000;
const ROW_HEIGHT = 48;
const LIST_HEIGHT = 400;

function VirtualizedRow({
  index,
  style,
  ariaAttributes,
}: RowComponentProps<object>) {
  return (
    <div
      {...ariaAttributes}
      className="flex items-center border-border border-b px-4 text-sm"
      style={style}
    >
      <span className="mr-3 text-muted-foreground tabular-nums">
        #{index + 1}
      </span>
      <span>List item {index + 1}</span>
    </div>
  );
}

export default function ListVirtualizationPage() {
  const rowProps = useMemo(() => ({}), []);

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ScrollText className="h-5 w-5 text-primary" />
              <CardTitle>List Virtualization</CardTitle>
            </div>
            <CardDescription>
              Only visible rows are rendered. This list has{" "}
              {ITEM_COUNT.toLocaleString()} items but stays performant thanks to
              react-window.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm">
              When rendering large datasets in React, virtualization prevents
              performance bottlenecks by only rendering the items currently
              visible in the viewport. Instead of mounting thousands of DOM
              nodes, we calculate which items should be visible based on scroll
              position and only render those. This dramatically reduces memory
              usage and improves scroll performance. I typically use libraries
              like react-window or TanStack Virtual to implement this
              efficiently.
            </p>
            <p className="text-muted-foreground text-sm">
              <strong>react-window</strong> renders a small window of items
              (plus overscan). As you scroll, it reuses DOM nodes and updates
              content instead of mounting thousands of components.
            </p>

            <div className="overflow-hidden rounded-lg border">
              <List
                overscanCount={5}
                rowComponent={VirtualizedRow}
                rowCount={ITEM_COUNT}
                rowHeight={ROW_HEIGHT}
                rowProps={rowProps}
                style={{ height: LIST_HEIGHT, width: "100%" }}
              />
            </div>

            <div className="rounded-lg bg-muted/50 p-4 text-sm">
              <p className="font-medium">Try it:</p>
              <ul className="mt-1 list-inside list-disc text-muted-foreground">
                <li>Scroll quickly — no jank</li>
                <li>Check DevTools: only ~15–20 rows exist in the DOM</li>
                <li>
                  Without virtualization, 10,000 items would mean 10,000 DOM
                  nodes
                </li>
              </ul>
              <p className="mt-3 text-muted-foreground">
                In a transaction dashboard with thousands of entries,
                virtualization ensures smooth scrolling without blocking the
                main thread.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
