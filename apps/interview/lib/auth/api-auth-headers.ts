import "server-only";

import { auth } from "@/lib/auth/clerk-server";

/** Bearer headers for user-scoped `apps/api` routes. Returns null when unsigned. */
export async function apiAuthHeaders(): Promise<Record<string, string> | null> {
  const token = await (await auth()).getToken();
  if (!token) {
    return null;
  }
  return { Authorization: `Bearer ${token}` };
}
