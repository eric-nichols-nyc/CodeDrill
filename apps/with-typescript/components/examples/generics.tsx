"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Input } from "@repo/design-system/components/ui/input";
import { useState } from "react";

function identity<T>(arg: T): T {
  return arg;
}

interface Box<T> {
  value: T;
  getValue(): T;
}

class Container<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  get(index: number): T | undefined {
    return this.items[index];
  }

  getAll(): T[] {
    return this.items;
  }
}

export const GenericsExamples = () => {
  const [input, setInput] = useState("");
  const [container] = useState(() => new Container<string>());
  const [items, setItems] = useState<string[]>([]);

  const handleAdd = () => {
    if (input.trim()) {
      container.add(input);
      setItems([...container.getAll()]);
      setInput("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generic Container</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            onChange={(e) => {
              setInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAdd();
              }
            }}
            placeholder="Enter a value"
            value={input}
          />
          <Button onClick={handleAdd}>Add</Button>
        </div>
        <div className="rounded-lg bg-muted p-4">
          <p className="mb-2 font-semibold text-sm">Items in container:</p>
          {items.length > 0 ? (
            <ul className="list-inside list-disc space-y-1 text-sm">
              {items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">No items yet</p>
          )}
        </div>
        <div className="rounded-lg bg-muted p-4">
          <p className="text-xs">
            Type: <code className="text-xs">Container&lt;string&gt;</code>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
