import "server-only";
import { neonAuth } from "@neondatabase/neon-js/auth/next";
import { keys } from "./keys";

/**
 * Validates `NEON_AUTH_BASE_URL` (via `keys()`) before calling `neonAuth()`.
 * Without a valid absolute URL, `neonAuth()` throws `TypeError: Invalid URL`.
 */
export async function getSession(): Promise<unknown> {
  keys();
  return await neonAuth();
}

export type NeonAuthState = {
  session: unknown;
  user: unknown;
};

/** Session + user for RSC; return type kept loose to avoid non-portable inferred types. */
export async function getNeonAuth(): Promise<NeonAuthState> {
  keys();
  return neonAuth() as Promise<NeonAuthState>;
}
