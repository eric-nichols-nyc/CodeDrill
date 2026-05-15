/** Extracts Neon Auth user id from `getNeonAuth().user`. */
export function neonUserId(user: unknown): string | null {
  if (typeof user !== "object" || user === null || !("id" in user)) {
    return null;
  }
  const id = (user as { id: unknown }).id;
  return typeof id === "string" && id.length > 0 ? id : null;
}
