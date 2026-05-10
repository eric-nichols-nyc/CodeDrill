"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Header = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  if (isHomePage) {
    return null;
  }

  return (
    <header className="flex h-16 items-center border-b bg-background p-4">
      <Link
        className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
        href="/"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>
    </header>
  );
};
