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
| `admin` | — | `features/admin/` | `apps/api` problems CRUD via BFF | **Spec TODO** |
| `problem-detail` | — | `features/problem-detail/` | workspace-code, chat (partial) | **Spec TODO** |
| `problems-page` | — | `features/problems-page/` | catalog fetch | **Spec TODO** |
| `landing` | — | `features/landing/` | — | **Spec TODO** |
| `docs` | — | `features/docs/` | — | **Spec TODO** |

Nested areas (e.g. `problem-detail/.../workspace-code`) are documented inside the parent feature spec when that spec is written, or in a child section — not as separate top-level features unless they ship independently.
