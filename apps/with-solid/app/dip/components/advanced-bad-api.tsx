"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { useState } from "react";

/**
 * ❌ BAD: Depends on concrete implementation (fetch API)
 * Hard to test, hard to swap implementations
 */
export const AdvancedBadApi = () => {
  const [data, setData] = useState<string>("");

  const fetchData = async () => {
    // Direct dependency on fetch API
    const response = await fetch("https://api.example.com/data");
    const json = await response.json();
    setData(JSON.stringify(json));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Client</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <button
          className="w-full rounded border p-2 hover:bg-accent"
          onClick={fetchData}
        >
          Fetch Data (Direct fetch dependency)
        </button>
        {data && (
          <div className="rounded border p-2 text-sm">
            <pre>{data}</pre>
          </div>
        )}
        <p className="text-muted-foreground text-xs">
          Hard to test or swap with mock API
        </p>
      </CardContent>
    </Card>
  );
};
