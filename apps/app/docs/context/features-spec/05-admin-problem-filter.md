# Feature update: admin — problem catalog & added status

## Goal

On `/admin`, give admins a **browseable catalog** of bundled problem templates (today scattered in the dev autofill dropdown) and show **whether each template is already in the database**. Filter the catalog by added / not-added, difficulty, and text search. Selecting a not-added template should jump to add flow with the form prefilled.

## Reference

- [01-design-system.md](./01-design-system.md) — feature folder layout, SOLID, semantic tokens.
- [00-index.md](./00-index.md) — parent feature: `admin`.
- Existing bundled templates: `apps/app/features/admin/problems/*.ts` and `dev-admin-problem-fill.tsx`.
- DB list already loaded on admin route via `fetchProblemsList()` → `AdminPageShell`.

## Product decisions (locked)

| Topic | Decision |
| ----- | -------- |
| **Catalog source (v1)** | In-app **registry** (`admin-problem-catalog.ts`) listing bundled templates — not a new DB table. |
| **“Added” source of truth** | Rows returned from **`GET /problems`** (same fetch as today’s admin list). |
| **Match template → DB row (v1)** | Stable **`catalogKey`** on each registry entry; row is “added” if any DB problem matches by **`catalogKey`** **or** normalized **`title`** (case-insensitive trim). Title fallback covers rows created before `catalogKey` exists on the API. |
| **Match template → DB row (v1.1)** | Optional column `problems.catalog_key` (unique, nullable). Set when creating/updating from a catalog entry. Title fallback remains for legacy rows. |
| **Slug on create from catalog** | Use `{catalogKey}` as slug (no timestamp suffix) when admin picks a catalog item. Uniqueness enforced by API; admin resolves conflicts manually. |
| **UI mode** | Left pane gains a **Catalog** tab (or toggle) alongside existing **In database** list. Default tab: **Catalog**. |
| **Added indicator** | Badge: **Added** (muted/green outline) vs **Not added** (default). Added rows show linked DB `id` in tooltip or secondary line when known. |
| **Filters (catalog tab)** | Text (title / catalogKey / LC label), difficulty, status (**All** / **Not added** / **Added**). Client-side only on loaded data. |
| **Empty filter** | “No catalog items match” — do not clear selection in the other tab. |
| **Dev autofill dropdown** | Keep for now; catalog supersedes it for discovery. Remove dropdown in a later pass once catalog ships. |

### Registry entry shape

```ts
type AdminProblemCatalogEntry = {
  catalogKey: string; // stable id, e.g. "contains-duplicate"
  title: string; // display; must match template CreateProblemBody.title
  difficulty: "easy" | "medium" | "hard";
  patternSlug?: string;
  leetcodeNumber?: number; // optional, for label e.g. "LC 217"
  sectionId?: string; // aligns with problem-list-sections.ts when set
  getPayload: () => CreateProblemBody;
};
```

`catalogKey` must be unique across the registry. Derive from slug prefix in template files (without timestamp suffix).

## User stories

1. As an admin, I want to see all bundled templates in one list, so I do not hunt through a dev dropdown.
2. As an admin, I want to see which templates are already in the database, so I avoid duplicate inserts.
3. As an admin, I want to filter to **Not added**, so I can work through the backlog.
4. As an admin, I want to open a not-added template prefilled on `/admin/add`, so I can publish quickly.

## Requirements

### Data

- [x] `admin-problem-catalog.ts` exports ordered `ADMIN_PROBLEM_CATALOG` built from existing `get*Problem()` modules (one registry, no duplicate imports in `dev-admin-problem-fill.tsx` long term).
- [x] Each bundled template module exposes or maps to a stable `catalogKey` (refactor slug to `` `${catalogKey}-${suffix}` `` only when suffix is still required for dev autofill collision).
- [x] `resolveCatalogAddedState(catalogEntry, dbProblems)` pure helper returns `{ isAdded: boolean; problemId?: string }`.
- [x] Admin route continues to pass `initialProblems` from `GET /problems` (no new list endpoint in v1).

### UI — catalog tab

- [x] Filter bar: search input, difficulty select (or toggles), status segmented control (All / Not added / Added).
- [x] List rows: title, optional `LC {n}` label, difficulty badge, added badge, pattern/section hint when present.
- [x] Count label: `{visible} of {total} templates` (respects filters).
- [x] **Not added** row action: navigate to `/admin/add?catalogKey={key}` (or client prefill if add page stays client-only).
- [x] **Added** row action: navigate to `/admin?id={problemId}` (existing deep link).

### UI — in database tab

- [x] Keep current `AdminProblemListPane` behavior (select → detail, edit dialog). Optional later: same text/difficulty filters as catalog.

### Routes

- [x] `/admin` — unchanged auth + `fetchProblemsList`; may pass through `catalogKey` query only on add route.
- [x] `/admin/add?catalogKey=` — resolve registry entry server- or client-side and pass `initialValues` to `NewProblemForm` with slug `{catalogKey}`.

## System boundaries

| Layer | Path | Notes |
| ----- | ---- | ----- |
| Feature UI | `apps/app/features/admin/` | Catalog registry, filter hook, list components |
| BFF | existing `/api/admin/problems` | Create still via POST; no new routes in v1 |
| API | `apps/api/src/problems/` | v1: no schema change. v1.1: optional `catalog_key` column + DTO |
| Database | `problems` | v1: match on title. v1.1: `catalog_key` unique nullable |

## Proposed file structure

```txt
features/admin/
  lib/
    admin-problem-catalog.ts       # ADMIN_PROBLEM_CATALOG registry
    resolve-catalog-added-state.ts # pure match helper
  hooks/
    use-admin-problem-catalog-filter.ts
  components/
    admin-problem-catalog-pane.tsx
    admin-problem-catalog-filters.tsx
    admin-problem-list-tabs.tsx    # Catalog | In database
    admin-page-shell.tsx           # compose tabs + existing panes
```

## Matching algorithm (v1)

```ts
function normalizeTitle(title: string): string {
  return title.trim().toLowerCase();
}

function resolveCatalogAddedState(
  entry: AdminProblemCatalogEntry,
  dbProblems: AdminProblemListItem[]
): { isAdded: boolean; problemId?: string } {
  // v1.1: prefer dbProblems.find(p => p.catalogKey === entry.catalogKey)
  const byTitle = dbProblems.find(
    (p) => normalizeTitle(p.title) === normalizeTitle(entry.title)
  );
  if (byTitle) {
    return { isAdded: true, problemId: byTitle.id };
  }
  return { isAdded: false };
}
```

**Limitation:** Renamed DB titles will look “not added”. v1.1 `catalog_key` fixes that.

## Out of scope (this pass)

- Server-side catalog table or CMS.
- Syncing with external LeetCode API.
- Auto-delete or bulk import.
- Removing `DevAdminProblemFill` dropdown (follow-up).
- URL-synced filter query params on `/admin` (optional later).

## Acceptance criteria

- [x] Spec registered in [00-index.md](./00-index.md).
- [x] Single registry lists all templates currently in the dev autofill menu.
- [x] Catalog tab shows added / not-added correctly against live `GET /problems` data.
- [x] **Not added** filter shows only templates with no DB match.
- [x] Choosing a not-added template opens add flow with form prefilled and slug `{catalogKey}`.
- [x] Choosing an added template opens `/admin?id=…` for that row.
- [x] Feature folder layout matches [01-design-system.md](./01-design-system.md).
- [x] `pnpm typecheck` passes for `apps/app`.

## Implementation prompt for agents

Implement admin catalog + added status per this spec. Start with `admin-problem-catalog.ts` and `resolve-catalog-added-state.ts`, then catalog tab UI with client-side filters. Reuse `initialProblems` from the admin page — do not add a new list API for v1. Match added state by normalized title until `catalog_key` exists on the API. Wire `/admin/add?catalogKey=` to prefill from the registry. Keep `AdminPageShell` split layout and edit dialog unchanged for the **In database** tab.
