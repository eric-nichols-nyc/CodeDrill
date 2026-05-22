import "server-only";

import { cookies } from "next/headers";
import { AUTH_TOKEN_COOKIE } from "./token";

/** Bearer headers for user-scoped Nest routes. Returns null when unsigned. */
export async function apiAuthHeaders(): Promise<Record<string, string> | null> {
  const token = (await cookies()).get(AUTH_TOKEN_COOKIE)?.value;
  if (!token) {
    return null;
  }
  return { Authorization: `Bearer ${token}` };
}
