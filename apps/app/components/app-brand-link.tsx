"use client";

import { cn } from "@repo/design-system/lib/utils";
import Image from "next/image";
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
      <Image
        alt=""
        aria-hidden
        className={cn("h-8 w-8 shrink-0 object-contain", iconClassName)}
        height={32}
        priority
        src="/logo.png"
        width={32}
      />
      {showLabel ? (
        <span className="font-semibold text-foreground">{label}</span>
      ) : null}
    </Link>
  );
}
