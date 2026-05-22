# Feature specs index

Every **product feature** under `apps/app/features/<name>/` should have a spec in this folder before or alongside implementation.

## Convention

| File | Purpose |
| ---- | ------- |
| `01-design-system.md` | Shared UI structure (all features) |
| `NN-<feature-name>.md` | One feature per file (`NN` = order added, zero-padded) |
| `99-feature-spec-template.md` | Copy when starting a new feature |

**When adding a feature:**

1. Copy `99-feature-spec-template.md` → `NN-<feature-name>.md`.
2. Fill in goal, routes, API, file structure, acceptance criteria.
3. Add a row to the table below.
4. Link the spec from `progress-tracker.md` if the feature is in flight.

**Layers (not duplicated in app feature folder):**

| Layer | Path |
| ----- | ---- |
| Nest API | `apps/api/src/<module>/` |
| Next BFF | `apps/app/app/api/...` |
| Feature UI | `apps/app/features/<name>/` |

## Registry

| Feature | Spec | App UI | API / BFF | Status |
| ------- | ---- | ------ | --------- | ------ |
| *(shared)* | [01-design-system.md](./01-design-system.md) | — | — | Active |
| `admin-chat-layout` | [02-admin-chat-layout.md](./02-admin-chat-layout.md) | `features/admin-chat-layout/` | None (static chat) | Shipped |
| `problem-progress` | [03-problem-progress.md](./03-problem-progress.md) | `features/problem-progress/` | `apps/api/src/problem-progress/`, BFF `app/api/problems/[problemId]/progress/` | In progress |
| `admin` | [05-admin-problem-filter.md](./05-admin-problem-filter.md) (catalog + added status) | `features/admin/` | `apps/api` problems CRUD via BFF | Shipped |
| `nav-drawer` | [06-nav-drawer.md](./06-nav-drawer.md) | `features/nav-drawer/` | Reuse `GET /problems` via `fetchProblemsList` | Shipped |
| `problem-detail` | [07-problem-chat-ui.md](./07-problem-chat-ui.md) (chatbot V1 UI) | `features/problem-detail/` | Nest `problem-chat/` + chat Server Actions + TanStack | **Chat UI shipped (V1)** |
| `api-auth` | [08-api-auth-consolidation.md](./08-api-auth-consolidation.md) | `lib/auth/`, `app/auth/` | `apps/api/src/auth.ts` + guards; Bearer token | **Spec only** |
| `problems-page` | [04-problems-page-list-ui.md](./04-problems-page-list-ui.md) (list UI delta) | `features/problems-page/` | catalog + tags + `patternSlug` sections | Shipped |
| `landing` | — | `features/landing/` | — | **Spec TODO** |
| `docs` | — | `features/docs/` | — | **Spec TODO** |

Nested areas (e.g. `problem-detail/.../workspace-code`) are documented inside the parent feature spec when that spec is written, or in a child section — not as separate top-level features unless they ship independently.
