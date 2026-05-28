"use client";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
} from "@repo/design-system/components/ai-elements/conversation";
import { Button } from "@repo/design-system/components/ui/button";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

function signInHref(pathname: string, search: string): string {
  const returnTo = `${pathname}${search}`;
  return `/sign-in?redirect_url=${encodeURIComponent(returnTo)}`;
}

export function TutorSignInPrompt() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const href = signInHref(pathname, search ? `?${search}` : "");

  return (
    <Conversation className="min-h-0 flex-1">
      <ConversationContent className="flex flex-col items-center gap-3">
        <ConversationEmptyState
          description="Sign in to ask the AI tutor for hints and explanations. Your conversations are saved to your account."
          title="Sign in to use the tutor"
        />
        <Button asChild size="sm">
          <Link href={href}>Sign in</Link>
        </Button>
      </ConversationContent>
    </Conversation>
  );
}
