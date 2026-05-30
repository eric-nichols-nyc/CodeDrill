"use client";

import { cn } from "@repo/design-system/lib/utils";
import { useState } from "react";

export function ExampleImagePreview({
  src,
  alt,
}: {
  src: string;
  alt?: string;
}) {
  const [failed, setFailed] = useState(false);
  const trimmed = src.trim();

  if (!trimmed || failed) {
    return (
      <p className="text-muted-foreground text-xs">
        {failed
          ? "Preview unavailable — check the path and that the file exists under public/."
          : null}
      </p>
    );
  }

  return (
    <div
      className={cn(
        "mt-2 max-w-xs overflow-hidden rounded-md border border-border bg-muted/30 p-2"
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- admin preview for arbitrary public paths */}
      <img
        alt={alt?.trim() || "Example illustration preview"}
        className="h-auto max-h-48 w-full object-contain"
        onError={() => setFailed(true)}
        src={trimmed}
      />
    </div>
  );
}
