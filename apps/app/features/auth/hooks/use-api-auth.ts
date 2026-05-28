"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useClerkAuthSnapshot } from "@/features/auth/components/clerk-auth-provider";

/** Client session from Clerk (identity for UI and practice BFF). */
export function useApiAuth() {
  const { userId: initialUserId } = useClerkAuthSnapshot();
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();

  const isPending = !isLoaded;

  if (isPending) {
    const signedInFromServer = Boolean(initialUserId);
    return {
      isPending: false,
      isSignedIn: signedInFromServer,
      session: signedInFromServer
        ? { id: initialUserId as string }
        : null,
      user: signedInFromServer
        ? {
            id: initialUserId as string,
            email: "",
            name: null,
            image: null,
          }
        : null,
    };
  }

  const signedIn = Boolean(isSignedIn);
  const resolvedUserId = userId ?? null;

  return {
    isPending: false,
    isSignedIn: signedIn,
    session: signedIn && resolvedUserId ? { id: resolvedUserId } : null,
    user:
      signedIn && (user || resolvedUserId)
        ? {
            id: user?.id ?? resolvedUserId ?? "",
            email: user?.primaryEmailAddress?.emailAddress ?? "",
            name: user?.fullName ?? null,
            image: user?.imageUrl ?? null,
          }
        : null,
  };
}
