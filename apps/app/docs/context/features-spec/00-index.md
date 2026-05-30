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
| `problem-workspace` (problem visualizer) | [15-problem-visualizer.md](./15-problem-visualizer.md) | `features/problem-workspace/visualizer/` + per-slug sub-folders | `apps/api` `problems.has_visualizer` (DTO + service) | **Shipped** — run migration `0002` + `db:migrate` |
| `problem-workspace` (state management) | [16-workspace-state-management.md](./16-workspace-state-management.md) | `features/problem-workspace/{shell,directions-panel,output-panel,chat-panel}/` | None (UI refactor only) | **Not started** — flatten prop drilling via `useWorkspace()` + `useDirectionsData()` |
| `admin` + `problem-workspace` (example images) | [17-problem-example-images.md](./17-problem-example-images.md) | `features/admin/`, `features/problem-workspace/directions-panel/` | `problem_examples.image_url`, `image_alt` | **Shipped (MVP)** — public-folder paths; S3 deferred |
| `api-auth` | [08-api-auth-consolidation.md](./08-api-auth-consolidation.md) | `lib/auth/` (Better Auth BFF token), `features/auth/` | `apps/api/src/auth.ts` + guards; Bearer token | **Shipped** (practice BFF; hybrid with Clerk) |
| `auth` | [14-auth.md](./14-auth.md) (Clerk UI + hybrid session model) | `features/auth/`, `app/(unauthenticated)/`, `lib/auth/` | Clerk + `nest-clerk-api`; Better Auth BFF for `apps/api` | **Shipped** (hybrid) |
| `clerk-neon-auth` | [clerk-neon-auth/](./clerk-neon-auth/README.md) — Stages [2](./clerk-neon-auth/02-clerk-frontend.md), [3](./clerk-neon-auth/03-webhook-provisioning.md) done; [07 BFF migration](./clerk-neon-auth/07-practice-bff-migration.md) next | `apps/app` Clerk UI + `nest-clerk-api` client | **`apps/nest-clerk-api/`** — webhook, `GET /me`; **`apps/api`** practice until Stage 7 | **In progress** — `/account` verified; Stage 7 not started |
| `problems-page` | [04-problems-page-list-ui.md](./04-problems-page-list-ui.md) (list UI delta) | `features/problems-page/` | catalog + tags + `patternSlug` sections | Shipped |
| Dev tooling | [18-tanstack-query-devtools.md](./18-tanstack-query-devtools.md) | `components/devtools/` | None | **Shipped** |
| `landing` | — | `features/landing/` | — | **Spec TODO** |
| `docs` | — | `features/docs/` | — | **Spec TODO** |

Nested areas (e.g. `problem-workspace/.../workspace-code`) are documented inside the parent feature spec when that spec is written, or in a child section — not as separate top-level features unless they ship independently.
