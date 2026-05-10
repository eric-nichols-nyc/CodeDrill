"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

export const TimeDisplay = () => {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    // Connect to the SSE endpoint
    const eventSource = new EventSource("/api/sse-time");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setTime(data.time);
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
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Clock className="h-8 w-8 text-primary" />
      </div>
      <div className="font-bold text-6xl tracking-tighter">{time}</div>
      <div className="text-muted-foreground text-sm">
        {new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
    </div>
  );
};
