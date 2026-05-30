"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@repo/design-system/lib/utils";

export function ExampleImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative max-w-full overflow-hidden rounded-md border border-border bg-background",
        className
      )}
    >
      <Image
        alt={alt}
        className="h-auto w-full object-contain"
        height={480}
        onError={() => setFailed(true)}
        sizes="(max-width: 768px) 100vw, 420px"
        src={src}
        unoptimized
        width={640}
      />
    </div>
  );
}
