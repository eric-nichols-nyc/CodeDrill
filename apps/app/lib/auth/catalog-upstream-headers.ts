import "server-only";

import { apiAuthHeaders } from "./api-auth-headers";
import { keys } from "./keys";

/** Headers for catalog/admin upstream calls: Bearer when signed in, optional internal secret. */
export async function catalogUpstreamHeaders(): Promise<Record<string, string>> {
  const k = keys();
  const auth = await apiAuthHeaders();

  return {
    ...(auth ?? {}),
    ...(k.INTERNAL_PROBLEMS_SECRET
      ? { "x-internal-problems-secret": k.INTERNAL_PROBLEMS_SECRET }
      : {}),
  };
}
