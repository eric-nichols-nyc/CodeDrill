# Workspace code: save on Run, load on page open

Editor text is stored in **`problem_workspace_code`** (one row per user + problem + language), not in **`submissions`**. Submissions remain for graded **Submit** attempts later.

**Related code**

- Queries: `features/problem-detail/components/problem-workspace/queries/`
- BFF: `app/api/problems/[problemId]/workspace-code/route.ts`
- API: `apps/api/src/problem-workspace-code/`
- Schema: `problem_workspace_code` in `apps/api/src/database/schema.ts`

## Sequence

```mermaid
sequenceDiagram
  participant Editor
  participant Hook as useProblemWorkspace
  participant RQ as TanStack Query
  participant BFF as Next /api/.../workspace-code
  participant API as Nest API
  participant DB as Postgres

  Note over Editor,DB: Page load
  Hook->>RQ: useWorkspaceCodeQuery(problemId)
  RQ->>BFF: GET workspace-code
  BFF->>API: GET + x-user-id
  API->>DB: SELECT by user + problem
  DB-->>Editor: merge into drafts by language

  Note over Editor,DB: User clicks Run
  Hook->>Hook: runClientTests (client)
  Hook->>RQ: mutate save { language, code }
  RQ->>BFF: PUT workspace-code
  BFF->>API: UPSERT
  API->>DB: problem_workspace_code
```

## Auth (BFF → API)

The Next route checks **Neon Auth**, then calls the Nest API with:

- `x-user-id` — Neon user id
- `x-internal-problems-secret` — when `INTERNAL_PROBLEMS_SECRET` is set (same pattern as admin problem routes)

Requires sign-in; unsigned users get an empty load and no save.

## Error handling

The BFF returns JSON `{ error, code, hint? }`. The workspace shows a red alert and logs save failures to the **Console** tab.

| `code` | Meaning |
|--------|---------|
| `NOT_SIGNED_IN` | No Neon Auth session — use **Sign in** in the banner |
| `MISSING_INTERNAL_SECRET` | Set `INTERNAL_PROBLEMS_SECRET` on **both** `apps/app` and `apps/api` |
| `UPSTREAM_UNAUTHORIZED` | Secret mismatch or API not restarted |
| `INVALID_SESSION` | Signed in but user id missing from session |

## Export diagram as image

Copy the Mermaid block into [Mermaid Live Editor](https://mermaid.live) and export PNG/SVG.
