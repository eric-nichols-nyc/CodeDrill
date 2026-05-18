import { cn } from "@repo/design-system/lib/utils";
import type { ReactNode } from "react";

export type AppHeaderInnerProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Shared horizontal rule for app headers: centered content up to `max-w-6xl`,
 * consistent height and page gutters.
 */
export function AppHeaderInner({ children, className }: AppHeaderInnerProps) {
  return (
    <div
      className={cn(
        "mx-auto flex h-12 w-full items-center justify-between gap-4 px-4 sm:px-6",
        className
      )}
    >
      {children}
    </div>
  );
}
