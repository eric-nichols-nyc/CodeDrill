"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { useState } from "react";

type Status = "pending" | "approved" | "rejected";

export const UnionExamples = () => {
  const [status, setStatus] = useState<Status>("pending");

  const processStatus = (s: Status): string => {
    if (s === "pending") {
      return "Processing...";
    }
    if (s === "approved") {
      return "✓ Approved";
    }
    return "✗ Rejected";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Example</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setStatus("pending");
            }}
            size="sm"
            variant={status === "pending" ? "default" : "outline"}
          >
            Pending
          </Button>
          <Button
            onClick={() => {
              setStatus("approved");
            }}
            size="sm"
            variant={status === "approved" ? "default" : "outline"}
          >
            Approved
          </Button>
          <Button
            onClick={() => {
              setStatus("rejected");
            }}
            size="sm"
            variant={status === "rejected" ? "default" : "outline"}
          >
            Rejected
          </Button>
        </div>
        <div className="rounded-lg bg-muted p-4">
          <p className="font-mono text-sm">
            Status: <span className="font-semibold">{status}</span>
          </p>
          <p className="mt-2 text-sm">{processStatus(status)}</p>
        </div>
      </CardContent>
    </Card>
  );
};
