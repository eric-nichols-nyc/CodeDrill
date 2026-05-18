export type DocsNavEntry =
  | { kind: "root"; href: "/docs"; label: string }
  | { kind: "section"; label: string }
  | { kind: "file"; slug: string; label: string };

/**
 * Sidebar and allowed slugs under `/docs/[...slug]` (paths under `apps/app/docs/`).
 * File slugs use `/` for nested paths (e.g. `context/architecture` → `docs/context/architecture.md`).
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
  { kind: "file", slug: "AGENTS", label: "Agents" },
  { kind: "section", label: "Context" },
  { kind: "file", slug: "context/project-overview", label: "Project overview" },
  { kind: "file", slug: "context/architecture", label: "Architecture" },
  { kind: "file", slug: "context/ui-context", label: "UI context" },
  { kind: "file", slug: "context/code-standards", label: "Code standards" },
  {
    kind: "file",
    slug: "context/ai-workflow-rules",
    label: "AI workflow rules",
  },
  {
    kind: "file",
    slug: "context/progress-tracker",
    label: "Progress tracker",
  },
];

export function getAllowedDocSlugs(): string[] {
  return DOCS_NAV.filter((e) => e.kind === "file").map((e) => e.slug);
}

export function getDocNavLabel(slug: string): string | undefined {
  const entry = DOCS_NAV.find((e) => e.kind === "file" && e.slug === slug);
  return entry?.label;
}
