import "server-only";

import { auth, currentUser } from "@/lib/auth/clerk-server";
import type { ApiAuthSession, ApiAuthState, ApiAuthUser } from "./types";

export type { ApiAuthSession, ApiAuthState, ApiAuthUser } from "./types";

const emptyState: ApiAuthState = { session: null, user: null };

/** Server session for protected pages and future interview BFF calls. */
export async function getApiAuth(): Promise<ApiAuthState> {
  const { userId, isAuthenticated } = await auth();

  if (!isAuthenticated || !userId) {
    return emptyState;
  }

  const clerkUser = await currentUser();

  return {
    session: { id: userId, expiresAt: "" },
    user: {
      id: userId,
      email: clerkUser?.primaryEmailAddress?.emailAddress ?? "",
      name: clerkUser?.fullName ?? null,
      image: clerkUser?.imageUrl ?? null,
    },
  };
}
