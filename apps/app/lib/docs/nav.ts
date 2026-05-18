export type DocsNavEntry =
  | { kind: "root"; href: "/docs"; label: string }
  | { kind: "file"; slug: string; label: string };

/**
 * Sidebar and allowed slugs under `/docs/[slug]` (files in `apps/app/docs/*.md`).
 */
export const DOCS_NAV: DocsNavEntry[] = [
  { kind: "root", href: "/docs", label: "App README" },
  { kind: "file", slug: "prd", label: "PRD" },
  {
    kind: "file",
    slug: "problems-list-filtering",
    label: "Problems list & filters",
  },
  {
    kind: "file",
    slug: "workspace-code-save-flow",
    label: "Workspace code save",
  },
];

export function getAllowedDocSlugs(): string[] {
  return DOCS_NAV.filter((e) => e.kind === "file").map((e) => e.slug);
}

export function getDocNavLabel(slug: string): string | undefined {
  const entry = DOCS_NAV.find((e) => e.kind === "file" && e.slug === slug);
  return entry?.label;
}
