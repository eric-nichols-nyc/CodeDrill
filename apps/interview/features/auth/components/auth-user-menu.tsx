"use client";

import { useClerk } from "@clerk/nextjs";
import { Button } from "@repo/design-system/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/design-system/components/ui/dropdown-menu";
import { CircleUser } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useApiAuth } from "@/features/auth/hooks/use-api-auth";

function signInHref(pathname: string, search: string): string {
  const returnTo = `${pathname}${search}`;
  return `/sign-in?redirect_url=${encodeURIComponent(returnTo)}`;
}

export function AuthUserMenu() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const { signOut } = useClerk();
  const { isPending, isSignedIn, user } = useApiAuth();

  if (isPending) {
    return (
      <button
        aria-busy="true"
        aria-label="Account menu"
        className="flex h-8 w-8 items-center justify-center rounded-md border border-border"
        disabled
        type="button"
      >
        <CircleUser className="h-4 w-4" />
      </button>
    );
  }

  if (!isSignedIn) {
    return (
      <Button asChild size="sm" variant="outline">
        <Link href={signInHref(pathname, search ? `?${search}` : "")}>
          Sign in
        </Link>
      </Button>
    );
  }

  const email =
    user && typeof user.email === "string" && user.email.length > 0
      ? user.email
      : "Account";

  async function onSignOut() {
    await signOut();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Account menu"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-accent"
          type="button"
        >
          <CircleUser className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem disabled className="text-muted-foreground text-xs">
          {email}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onSignOut}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
