"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { useState } from "react";
import { FetchAdapter } from "./http/fetch-adapter";
import { HttpClient } from "./http/http-client";
import { MockAdapter } from "./http/mock-adapter";

/**
 * ✅ GOOD: Depends on abstraction (HttpClient interface)
 * Easy to test, easy to swap implementations
 */
export const AdvancedGoodApi = () => {
  const [data, setData] = useState<string>("");
  const [useMock, setUseMock] = useState(false);

  // Can swap implementations easily
  const httpClient = new HttpClient(
    useMock ? new MockAdapter() : new FetchAdapter()
  );

  const fetchData = async () => {
    // Depends on abstraction, not concrete implementation
    const result = await httpClient.get("https://api.example.com/data");
    setData(JSON.stringify(result));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Client</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="flex gap-2">
          <button
            className="flex-1 rounded border p-2 hover:bg-accent"
            onClick={fetchData}
          >
            Fetch Data
          </button>
          <button
            className="rounded border p-2 text-xs hover:bg-accent"
            onClick={() => setUseMock(!useMock)}
          >
            {useMock ? "Use Real API" : "Use Mock"}
          </button>
        </div>
        {data && (
          <div className="rounded border p-2 text-sm">
            <pre>{data}</pre>
          </div>
        )}
        <p className="text-muted-foreground text-xs">
          Easy to test with mock, easy to swap implementations
        </p>
      </CardContent>
    </Card>
  );
};
