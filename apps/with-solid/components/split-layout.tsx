import { cn } from "@repo/design-system/lib/utils";
import type { ReactNode } from "react";

type SplitLayoutProperties = {
  readonly left: ReactNode;
  readonly right: ReactNode;
  readonly className?: string;
  readonly leftClassName?: string;
  readonly rightClassName?: string;
};

export const SplitLayout = ({
  left,
  right,
  className,
  leftClassName,
  rightClassName,
}: SplitLayoutProperties) => (
  <div
    className={cn("flex min-h-full flex-col gap-4 p-4 lg:flex-row", className)}
  >
    <div
      className={cn(
        "flex flex-1 flex-col overflow-hidden rounded-lg border bg-card",
        leftClassName
      )}
    >
      {left}
    </div>
    <div
      className={cn(
        "flex flex-1 flex-col overflow-hidden rounded-lg border bg-card",
        rightClassName
      )}
    >
      {right}
    </div>
  </div>
);
