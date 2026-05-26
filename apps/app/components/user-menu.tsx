"use client";

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
import { useRouter } from "next/navigation";
import { useApiAuth } from "@/features/auth/hooks/use-api-auth";
import { signOutAndClearToken } from "@/lib/auth/client";

const iconTriggerClassName =
  "flex h-8 w-8 items-center justify-center rounded transition-colors duration-150 text-[var(--nav-icon)] hover:bg-white/5 hover:text-[var(--nav-icon-hover)]";

type UserMenuProps = {
  /** Use dark nav styling (problem workspace header). */
  variant?: "default" | "nav";
};

export function UserMenu({ variant = "default" }: UserMenuProps) {
  const router = useRouter();
  const { isPending, isSignedIn, user } = useApiAuth();

  if (isPending) {
    return (
      <button
        aria-busy="true"
        aria-label="Account menu"
        className={
          variant === "nav"
            ? iconTriggerClassName
            : "flex h-9 w-9 items-center justify-center rounded-md border border-border hover:bg-accent"
        }
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
        <Link href="/auth/sign-in">Sign in</Link>
      </Button>
    );
  }

  const email =
    user && typeof user.email === "string" ? user.email : "Account";

  async function onSignOut() {
    await signOutAndClearToken();
    router.push("/");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Account menu"
          className={
            variant === "nav"
              ? iconTriggerClassName
              : "flex h-9 w-9 items-center justify-center rounded-md border border-border hover:bg-accent"
          }
          type="button"
        >
          <CircleUser className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5 text-muted-foreground text-xs">{email}</div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/problems">Problems</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account">Account</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => void onSignOut()}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
