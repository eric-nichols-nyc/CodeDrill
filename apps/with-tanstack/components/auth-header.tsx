"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";

export function AuthHeader() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const handleSignOut = async () => {
    await signOut();
    router.refresh();
  };

  if (isPending) {
    return <div className="h-9 w-20 animate-pulse rounded bg-muted" />;
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground text-sm">
          {session.user.name ?? session.user.email}
        </span>
        <Button onClick={handleSignOut} size="sm" variant="outline">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <Button asChild size="sm" variant="outline">
      <Link href="/sign-in">
        <LogIn className="mr-2 h-4 w-4" />
        Sign in
      </Link>
    </Button>
  );
}
