"use client";

import type { ReactNode } from "react";

type ZonesHeaderProps = {
  /** Optional: custom link component (e.g. Next.js Link). Unused for zone links; see multi-zones docs. */
  linkComponent?: React.ComponentType<{
    href: string;
    children: ReactNode;
    className?: string;
  }>;
  /** Optional: class name for the header container */
  className?: string;
};

const linkClass =
  "font-medium text-sm transition-colors hover:text-primary";

/**
 * Zone nav links use plain <a> so href is always absolute from origin.
 * Next.js Link would prepend basePath (e.g. /optimization/security instead of /security).
 * See: https://nextjs.org/docs/app/building-your-application/deploying/multi-zones#linking-between-zones
 */
function ZonesHeader({ className }: ZonesHeaderProps) {
  return (
    <header
      className={
        className ??
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
      }
    >
      <nav className="container flex h-14 items-center gap-6 px-4">
        <a className={linkClass} href="/">
          Home
        </a>
        <a className={linkClass} href="/security">
          Security
        </a>
        <a className={linkClass} href="/optimization">
          Optimization
        </a>
        <a className={linkClass} href="/scalable">
          Scalable
        </a>
        <a className={linkClass} href="/render-lab">
          Render Lab
        </a>
      </nav>
    </header>
  );
}

export { ZonesHeader, type ZonesHeaderProps };
