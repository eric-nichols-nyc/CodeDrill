/** Study-plan section catalog (fixed order). Grouping uses `problem.patternSlug`. */

export type ProblemListSectionConfig = {
  id: string;
  label: string;
  patternSlugs: readonly string[];
};

export const PROBLEM_LIST_SECTIONS: readonly ProblemListSectionConfig[] = [
  {
    id: "array-string",
    label: "Array / String",
    patternSlugs: ["array-string", "array", "string"],
  },
  {
    id: "two-pointers",
    label: "Two Pointers",
    patternSlugs: ["two-pointers"],
  },
  {
    id: "sliding-window",
    label: "Sliding Window",
    patternSlugs: ["sliding-window"],
  },
  {
    id: "hash-map-set",
    label: "Hash Map / Set",
    patternSlugs: ["hash-map", "hash-set", "hash-table"],
  },
] as const;

export const UNCATEGORIZED_SECTION_ID = "uncategorized";

const SLUG_TO_SECTION_ID = new Map<string, string>();

for (const section of PROBLEM_LIST_SECTIONS) {
  for (const slug of section.patternSlugs) {
    SLUG_TO_SECTION_ID.set(slug, section.id);
  }
}

export function resolveProblemListSectionId(patternSlug?: string): string {
  const normalized = patternSlug?.trim().toLowerCase();
  if (!normalized) {
    return UNCATEGORIZED_SECTION_ID;
  }
  return SLUG_TO_SECTION_ID.get(normalized) ?? UNCATEGORIZED_SECTION_ID;
}

export function problemListSectionLabel(sectionId: string): string {
  if (sectionId === UNCATEGORIZED_SECTION_ID) {
    return "Uncategorized";
  }
  const section = PROBLEM_LIST_SECTIONS.find((s) => s.id === sectionId);
  return section?.label ?? "Uncategorized";
}
