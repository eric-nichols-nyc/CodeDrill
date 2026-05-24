import { cn } from "@repo/design-system/lib/utils";
import type { ReactNode } from "react";

export function ShellPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  );
}
