import { headers } from "next/headers";
import { keys } from "@/lib/auth/keys";
import { getNeonAuth } from "@/lib/auth/server";
import { neonUserId } from "@/lib/auth/neon-user-id";

const TRAILING_SLASH = /\/$/;

export function problemsApiBaseUrl(): string {
  const fromEnv = keys().NEON_JWT_API_URL;
  return (fromEnv ?? "http://localhost:3030").replace(TRAILING_SLASH, "");
}

/** Headers for user-scoped Nest routes (Neon session + optional internal secret). */
export async function upstreamUserHeaders(): Promise<
  Record<string, string> | null
> {
  const { session, user } = await getNeonAuth();
  if (!session) {
    return null;
  }

  const userId = neonUserId(user);
  if (!userId) {
    return null;
  }

  const h = await headers();
  const cookie = h.get("cookie");
  const internalSecret = keys().INTERNAL_PROBLEMS_SECRET;

  return {
    ...(cookie ? { Cookie: cookie } : {}),
    "x-user-id": userId,
    ...(internalSecret
      ? { "x-internal-problems-secret": internalSecret }
      : {}),
  };
}
