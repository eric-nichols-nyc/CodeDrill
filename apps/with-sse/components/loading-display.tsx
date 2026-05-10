"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export const LoadingDisplay = () => {
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    // Connect to the SSE endpoint
    const eventSource = new EventSource("/api/sse-loading");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setProgress(data.progress);
      setStatus(data.status);
    };

    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
      eventSource.close();
    };

    // Cleanup: close the connection when component unmounts
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{status}</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full bg-primary transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
