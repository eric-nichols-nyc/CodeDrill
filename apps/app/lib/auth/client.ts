"use client";

import { createAuthClient } from "better-auth/react";
import {
  clearAuthToken,
  persistAuthToken,
  readAuthTokenFromStorage,
} from "./token";

function authClientBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return (
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3010"
  ).replace(/\/$/, "");
}

type AuthCallbackContext = { response: Response };

/** Narrow client surface — avoids non-portable inferred exports from better-auth. */
export type AppAuthClient = {
  signIn: {
    email: (
      body: { email: string; password: string },
      callbacks?: { onSuccess?: (ctx: AuthCallbackContext) => void }
    ) => Promise<{ error: { message?: string } | null }>;
  };
  signUp: {
    email: (
      body: { email: string; password: string; name: string },
      callbacks?: { onSuccess?: (ctx: AuthCallbackContext) => void }
    ) => Promise<{ error: { message?: string } | null }>;
  };
  signOut: () => Promise<unknown>;
  useSession: () => {
    data: { session: unknown; user: { email?: string } | null } | null;
    isPending: boolean;
  };
};

export const authClient = createAuthClient({
  baseURL: authClientBaseUrl(),
  fetchOptions: {
    auth: {
      type: "Bearer",
      token: () => readAuthTokenFromStorage(),
    },
    onSuccess: (ctx) => {
      const token = ctx.response.headers.get("set-auth-token");
      if (token) {
        persistAuthToken(token);
      }
    },
  },
}) as AppAuthClient;

export async function signOutAndClearToken(): Promise<void> {
  await authClient.signOut();
  clearAuthToken();
}
