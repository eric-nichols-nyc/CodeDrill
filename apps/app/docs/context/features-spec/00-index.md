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
| `admin` (AI problem form generation) | [12-ai-problem-form-generation.md](./12-ai-problem-form-generation.md) | `features/admin/components/` | Nest `POST /problems/generate` + BFF `app/api/admin/problems/generate/` | **In progress** — Stages 1–4 shipped; Stage 5 tests remaining |
| `nav-drawer` | [06-nav-drawer.md](./06-nav-drawer.md) | `features/nav-drawer/` | Reuse `GET /problems` via `fetchProblemsList` | Shipped |
| `nav-drawer` (list UI) | [12-nav-drawer-list-ui.md](./12-nav-drawer-list-ui.md) (striping, active row, `/problems` toolbar parity) | `features/nav-drawer/` | None (client filter on loaded catalog) | **Shipped** |
| `problem-workspace` | [07-problem-chat-ui.md](./07-problem-chat-ui.md) (chatbot V1 UI) | `features/problem-workspace/` | Nest `problem-chat/` + chat Server Actions + TanStack | **Chat UI shipped (V1)** |
| `problem-workspace` (chat streaming) | [09-problem-chat-streaming.md](./09-problem-chat-streaming.md) | `features/problem-workspace/chatbot/` | Nest stream + BFF + `useChat` | **Round 1 shipped** |
| `problem-workspace` (chat message UI) | [10-problem-chat-message-ui.md](./10-problem-chat-message-ui.md) | `features/problem-workspace/chatbot/components/` | None (UI-only; optional vote API later) | **Shipped** |
| `problem-workspace` (chat starter suggestions) | [13-problem-chat-starter-suggestions.md](./13-problem-chat-starter-suggestions.md) | `features/problem-workspace/chat-panel/` | None (UI-only; static copy) | **Shipped (Stage 1)** |
| `problem-workspace` (workspace refactor) | [11-workspace-refactor.md](./11-workspace-refactor.md) | `features/problem-workspace/{shell,directions-panel,editor-panel,output-panel,chat-panel}/` | None (UI layout only) | **In progress** — panels wired; file moves done |
| `api-auth` | [08-api-auth-consolidation.md](./08-api-auth-consolidation.md) | `lib/auth/`, `features/auth/`, `app/auth/` | `apps/api/src/auth.ts` + guards; Bearer token | **Shipped** |
| `auth` | [14-auth.md](./14-auth.md) (session model, route guard, tutor requires sign-in) | `features/auth/`, `lib/auth/` | Better Auth on Nest; BFF `/api/auth/*` | **Shipped** |
| `clerk-neon-auth` | [clerk-neon-auth/](./clerk-neon-auth/README.md) — reuse Better Auth **`user`** table (`id` = Clerk `sub`); [00 Drizzle](./clerk-neon-auth/00-drizzle.md) | *Deferred* (`apps/app` Clerk UI) | **`apps/nest-clerk-api/`** — shared Neon DB; no `apps/api` edits | **In progress** — Stages 0–1, 3–5 |
| `problems-page` | [04-problems-page-list-ui.md](./04-problems-page-list-ui.md) (list UI delta) | `features/problems-page/` | catalog + tags + `patternSlug` sections | Shipped |
| `landing` | — | `features/landing/` | — | **Spec TODO** |
| `docs` | — | `features/docs/` | — | **Spec TODO** |

Nested areas (e.g. `problem-workspace/.../workspace-code`) are documented inside the parent feature spec when that spec is written, or in a child section — not as separate top-level features unless they ship independently.
