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

type PartialUser = Partial<User>;
type PickUser = Pick<User, "name" | "email">;
type OmitUser = Omit<User, "email">;

export const UtilityTypesExamples = () => {
  const [selectedType, setSelectedType] = useState<
    "original" | "partial" | "pick" | "omit"
  >("original");

  const examples = {
    original: {
      name: "John Doe",
      age: 30,
      email: "john@example.com",
    },
    partial: {
      name: "Jane Doe",
    } as PartialUser,
    pick: {
      name: "Bob Smith",
      email: "bob@example.com",
    } as PickUser,
    omit: {
      name: "Alice Johnson",
      age: 25,
    } as OmitUser,
  };

  const typeNames = {
    original: "User (original)",
    partial: "Partial<User>",
    pick: "Pick<User, 'name' | 'email'>",
    omit: "Omit<User, 'email'>",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Utility Type Transformations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(
            ["original", "partial", "pick", "omit"] as Array<
              keyof typeof examples
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
            {JSON.stringify(examples[selectedType], null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};
