"use client";

import { SidebarTrigger } from "@repo/design-system/components/ui/sidebar";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Header = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-4">
      <SidebarTrigger />
      {!isHomePage && (
        <Link
          className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
          href="/"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      )}
    </header>
  );
};
