import type { AdminProblemCatalogEntry } from "@/features/admin/lib/admin-problem-catalog";
import type { CreateProblemBody } from "@/features/admin/lib/create-problem-schema";

export function getCatalogProblemPayload(
  entry: AdminProblemCatalogEntry
): CreateProblemBody {
  const payload = entry.getPayload();

  return {
    ...payload,
    slug: entry.catalogKey,
  };
}
