"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Switch } from "@repo/design-system/components/ui/switch";
import { ArrowLeft, Minus, Plus, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useCounter } from "../../hooks/use-counter";
import { useToggle } from "../../hooks/use-toggle";

export default function HooksPage() {
  const counter = useCounter(0, { min: 0, max: 20 });
  const toggle = useToggle(false);

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        <Link
          className="mb-6 inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
          href="/"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to demos
        </Link>

        <h1 className="mb-2 font-bold text-3xl">Custom Hooks</h1>
        <p className="mb-8 text-muted-foreground">
          Interactive demos with testable custom hooks
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Counter Demo */}
          <Card>
            <CardHeader>
              <CardTitle>useCounter</CardTitle>
              <CardDescription>
                Bounded counter with min (0) and max (20)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={counter.decrement}
                  size="icon"
                  variant="outline"
                >
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">-</span>
                </Button>

                <span
                  className="w-16 text-center font-bold text-4xl"
                  data-testid="counter-value"
                >
                  {counter.count}
                </span>

                <Button
                  onClick={counter.increment}
                  size="icon"
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">+</span>
                </Button>
              </div>

              <div className="flex justify-center">
                <Button onClick={counter.reset} size="sm" variant="ghost">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>

              <div className="rounded-lg bg-muted p-3 font-mono text-xs">
                <pre>{JSON.stringify({ count: counter.count }, null, 2)}</pre>
              </div>
            </CardContent>
          </Card>

          {/* Toggle Demo */}
          <Card>
            <CardHeader>
              <CardTitle>useToggle</CardTitle>
              <CardDescription>Boolean toggle with helpers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center gap-4">
                <Switch
                  checked={toggle.value}
                  data-testid="toggle-switch"
                  onCheckedChange={toggle.toggle}
                />
                <span
                  className="w-12 font-semibold text-lg"
                  data-testid="toggle-status"
                >
                  {toggle.value ? "ON" : "OFF"}
                </span>
              </div>

              <div className="flex justify-center gap-2">
                <Button onClick={toggle.setTrue} size="sm" variant="outline">
                  Set True
                </Button>
                <Button onClick={toggle.setFalse} size="sm" variant="outline">
                  Set False
                </Button>
              </div>

              <div className="rounded-lg bg-muted p-3 font-mono text-xs">
                <pre>{JSON.stringify({ value: toggle.value }, null, 2)}</pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
