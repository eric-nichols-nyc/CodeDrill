"use client";

import { cn } from "@repo/design-system/lib/utils";
import { Code2 } from "lucide-react";
import Link from "next/link";

export type AppBrandLinkProps = {
  /** Shows the wordmark beside the icon. Default: false (icon only). */
  showLabel?: boolean;
  /** Accessible name when `showLabel` is false; also used as visible label when true. */
  label?: string;
  href?: string;
  className?: string;
  iconClassName?: string;
};

export function AppBrandLink({
  showLabel = false,
  label = "Codedrill",
  href = "/",
  className,
  iconClassName,
}: AppBrandLinkProps) {
  return (
    <Link
      aria-label={showLabel ? undefined : `${label}, home`}
      className={cn("inline-flex items-center gap-2", className)}
      href={href}
    >
      <Code2
        aria-hidden
        className={cn("h-6 w-6 shrink-0 text-foreground", iconClassName)}
      />
      {showLabel ? (
        <span className="font-semibold text-foreground">{label}</span>
      ) : null}
    </Link>
  );
}
