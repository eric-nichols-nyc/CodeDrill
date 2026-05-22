import "server-only";

import { apiBaseUrl } from "./api-url";
import { apiAuthHeaders } from "./api-auth-headers";

export type ApiAuthUser = {
  id: string;
  email: string;
  name: string | null;
  image?: string | null;
};

export type ApiAuthSession = {
  id: string;
  expiresAt: string;
};

export type ApiAuthState = {
  session: ApiAuthSession | null;
  user: ApiAuthUser | null;
};

const emptyState: ApiAuthState = { session: null, user: null };

/** Session + user from the Nest API (`GET /api/auth/get-session`). */
export async function getApiAuth(): Promise<ApiAuthState> {
  const headers = await apiAuthHeaders();
  if (!headers) {
    return emptyState;
  }

  try {
    const res = await fetch(`${apiBaseUrl()}/api/auth/get-session`, {
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      return emptyState;
    }

    const body = (await res.json()) as {
      session?: ApiAuthSession | null;
      user?: ApiAuthUser | null;
    };

    return {
      session: body.session ?? null,
      user: body.user ?? null,
    };
  } catch {
    return emptyState;
  }
}
