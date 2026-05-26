"use client";

import { useInitialAuthSession } from "@/features/auth/components/auth-session-provider";
import { authClient } from "@/lib/auth/client";

/** Client session from Better Auth (`GET /api/auth/get-session` via app proxy). */
export function useApiAuth() {
  const initialAuth = useInitialAuthSession();
  const { data, isPending } = authClient.useSession();

  if (isPending && initialAuth !== null) {
    return {
      isPending: false,
      isSignedIn: Boolean(initialAuth.session),
      session: initialAuth.session,
      user: initialAuth.user,
    };
  }

  return {
    isPending,
    isSignedIn: Boolean(data?.session),
    session: data?.session ?? null,
    user: data?.user ?? null,
  };
}
