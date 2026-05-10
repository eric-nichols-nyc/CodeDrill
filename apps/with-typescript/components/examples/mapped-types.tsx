"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { useState } from "react";

type User = {
  name: string;
  age: number;
  email: string;
};

type ReadonlyUser = {
  readonly [P in keyof User]: User[P];
};

type OptionalUser = {
  [P in keyof User]?: User[P];
};

type StringifyUser = {
  [P in keyof User]: string;
};

export const MappedTypesExamples = () => {
  const [selectedType, setSelectedType] = useState<
    "original" | "readonly" | "optional" | "stringify"
  >("original");

  const typeInfo = {
    original: {
      name: "John Doe",
      age: 30,
      email: "john@example.com",
    },
    readonly: {
      name: "Jane Doe",
      age: 25,
      email: "jane@example.com",
    } as ReadonlyUser,
    optional: {
      name: "Bob Smith",
    } as OptionalUser,
    stringify: {
      name: "Alice",
      age: "30",
      email: "alice@example.com",
    } as StringifyUser,
  };

  const typeNames = {
    original: "User (original)",
    readonly: "Readonly<User>",
    optional: "Partial<User>",
    stringify: "Stringify<User>",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mapped Type Transformations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(
            ["original", "readonly", "optional", "stringify"] as Array<
              keyof typeof typeInfo
            >
          ).map((type) => (
            <button
              className={`rounded px-3 py-1 text-xs transition-colors ${
                selectedType === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
              key={type}
              onClick={() => {
                setSelectedType(type);
              }}
              type="button"
            >
              {typeNames[type]}
            </button>
          ))}
        </div>
        <div className="rounded-lg bg-muted p-4">
          <p className="mb-2 font-semibold text-xs">
            {typeNames[selectedType]}
          </p>
          <pre className="text-xs">
            {JSON.stringify(typeInfo[selectedType], null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};
