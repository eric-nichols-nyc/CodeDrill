import type {
  ProblemSolutionRow,
  ProblemTag,
} from "@/features/problem-workspace/problem-detail-types";

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

export function normalizeDifficultyForDisplay(
  raw?: string
): "Easy" | "Medium" | "Hard" {
  const x = (raw ?? "").toLowerCase();
  if (x === "easy") {
    return "Easy";
  }
  if (x === "hard") {
    return "Hard";
  }
  return "Medium";
}

export function parseProblemTags(raw: unknown): ProblemTag[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const tags: ProblemTag[] = [];
  for (const item of raw) {
    const o = asRecord(item);
    if (!o) {
      continue;
    }
    const name = typeof o.name === "string" ? o.name.trim() : "";
    if (!name) {
      continue;
    }
    const slug =
      typeof o.slug === "string" && o.slug.length > 0 ? o.slug : name;
    const id =
      typeof o.id === "string" && o.id.length > 0 ? o.id : slug;
    tags.push({ id, name, slug });
  }
  return tags;
}
