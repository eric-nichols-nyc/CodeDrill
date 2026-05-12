import type { ProblemSolutionRow } from "@/features/problem-detail/problem-detail-types";

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

export function isProblemSolutionRow(value: unknown): value is ProblemSolutionRow {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const o = value as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.problemId === "string" &&
    typeof o.language === "string" &&
    typeof o.code === "string" &&
    (o.explanation === null || typeof o.explanation === "string") &&
    (o.timeComplexity === null || typeof o.timeComplexity === "string") &&
    (o.spaceComplexity === null || typeof o.spaceComplexity === "string") &&
    typeof o.createdAt === "string"
  );
}

export function isProblemSolutionRowArray(
  value: unknown
): value is ProblemSolutionRow[] {
  return Array.isArray(value) && value.every(isProblemSolutionRow);
}
