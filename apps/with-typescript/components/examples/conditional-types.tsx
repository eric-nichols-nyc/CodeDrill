"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";

type IsArray<T> = T extends Array<any> ? true : false;
type ArrayElement<T> = T extends Array<infer U> ? U : never;

export const ConditionalTypesExamples = () => (
  <Card>
    <CardHeader>
      <CardTitle>Conditional Type Examples</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-3">
        <div className="rounded-lg bg-muted p-3">
          <p className="font-semibold text-xs">
            IsArray&lt;string[]&gt; = true
          </p>
          <p className="mt-1 text-muted-foreground text-xs">
            string[] extends Array&lt;any&gt; ? true : false
          </p>
        </div>
        <div className="rounded-lg bg-muted p-3">
          <p className="font-semibold text-xs">IsArray&lt;number&gt; = false</p>
          <p className="mt-1 text-muted-foreground text-xs">
            number extends Array&lt;any&gt; ? true : false
          </p>
        </div>
        <div className="rounded-lg bg-muted p-3">
          <p className="font-semibold text-xs">
            ArrayElement&lt;string[]&gt; = string
          </p>
          <p className="mt-1 text-muted-foreground text-xs">
            Extracts the element type from an array
          </p>
        </div>
        <div className="rounded-lg bg-muted p-3">
          <p className="font-semibold text-xs">
            ArrayElement&lt;number[]&gt; = number
          </p>
          <p className="mt-1 text-muted-foreground text-xs">
            Works with any array type
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);
