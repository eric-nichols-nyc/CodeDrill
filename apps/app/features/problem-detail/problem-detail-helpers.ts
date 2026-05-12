export function asRecord(v: unknown): Record<string, unknown> | null {
  if (typeof v !== "object" || v === null) {
    return null;
  }
  return v as Record<string, unknown>;
}

export function strField(
  o: Record<string, unknown> | null,
  key: string
): string | null {
  if (!o) {
    return null;
  }
  const v = o[key];
  return typeof v === "string" ? v : null;
}

export function rowKey(
  o: Record<string, unknown> | null,
  fallback: string
): string {
  const id = strField(o, "id");
  return id ?? fallback;
}
