"use client";

import { useAuth, useUser } from "@clerk/nextjs";

/** Client session from Clerk (identity for UI and `nest-clerk-api`). */
export function useApiAuth() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();

  return {
    isPending: !isLoaded,
    isSignedIn: Boolean(isSignedIn),
    session: isSignedIn && userId ? { id: userId } : null,
    user: user
      ? {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress ?? "",
          name: user.fullName,
          image: user.imageUrl,
        }
      : null,
  };
}
