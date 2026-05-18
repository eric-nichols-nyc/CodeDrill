"use client";

import { cn } from "@repo/design-system/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOCS_NAV } from "@/lib/docs/nav";

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="shrink-0 border-border border-b lg:w-56 lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain lg:border-r lg:border-b-0">
      <nav
        aria-label="Documentation"
        className="flex gap-1 overflow-x-auto p-3 lg:flex-col lg:gap-0 lg:overflow-visible lg:p-4"
      >
        {DOCS_NAV.map((entry) => {
          if (entry.kind === "section") {
            return (
              <p
                className="mt-3 px-3 py-1 font-semibold text-muted-foreground text-xs uppercase tracking-wide first:mt-0"
                key={`section-${entry.label}`}
              >
                {entry.label}
              </p>
            );
          }

          const href =
            entry.kind === "root" ? entry.href : `/docs/${entry.slug}`;
          const label = entry.label;
          const active =
            entry.kind === "root"
              ? pathname === "/docs"
              : pathname === `/docs/${entry.slug}`;

          return (
            <Link
              className={cn(
                "whitespace-nowrap rounded-md px-3 py-2 font-medium text-sm transition-colors lg:whitespace-normal",
                active
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
              href={href}
              key={href}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
