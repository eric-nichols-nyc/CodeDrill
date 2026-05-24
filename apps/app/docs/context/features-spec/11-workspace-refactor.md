# Feature: workspace refactor

## Goal

Replace the scattered problem-page layout (custom `SplitLayout`, `ExpandableSidebarChat`, nested `ProblemDetail` → `ProblemWorkspace` splits) with a **single resizable shell** built on `@repo/design-system/components/ui/resizable`. Each pane becomes an owned folder under `features/problem-workspace/` with a clear entry component. The route composes `WorkspaceShell` + four panel roots; no pane owns another pane’s layout.

## Reference

- [01-design-system.md](./01-design-system.md) — feature folder layout, SOLID, tokens.
- [07-problem-chat-ui.md](./07-problem-chat-ui.md) — chat data/hook boundaries (paths change; behavior unchanged).
- [09-problem-chat-streaming.md](./09-problem-chat-streaming.md) — streaming send path.
- [10-problem-chat-message-ui.md](./10-problem-chat-message-ui.md) — message component split.
- [ui-context.md](../ui-context.md) — problem workspace viewport patterns.
- Working layout prototype: `features/dashboard/components/dashboard-resizable-demo.tsx` + `features/problem-workspace/components/workspace-shell.tsx` (dummy panels today).
- Design-system resizable: `packages/design-system/components/ui/resizable.tsx`.

## User story

As a developer working on CodeDrill, I want the problem workspace split into named panel folders with one shell compositor, so that I can find, change, and test each pane without tracing five wrapper files.

---

## Requirements

### Shell

- [ ] Add **`ShellPanel`** — presentational wrapper: `children` only (optional `className`). No dummy titles in production; padding `p-1`, `min-h-0`, `overflow-hidden`. Replaces inline `ShellPanel` in `workspace-shell.tsx`.
- [ ] **`WorkspaceShell`** lives in `shell/` and owns:
  - horizontal `ResizablePanelGroup` (directions | center | chat)
  - nested vertical group in center (editor | output)
  - `ResizableHandle withHandle` between all panes
  - `autoSaveId="codedrill-problem-workspace"`
  - **slot props** (or explicit panel root components): `directions`, `editor`, `output`, `chat`
- [ ] Remove dependency on app `SplitLayout` for the problem page.
- [ ] Delete **`ExpandableSidebarChat`** after chat panel is wired (custom resize/collapse replaced by shell).

### Panel folders

Each panel is a top-level folder under `features/problem-workspace/` (not nested under `components/`). Each exports one **panel root** component consumed by `WorkspaceShell`.

| Panel folder | Root export | Responsibility |
| ------------ | ----------- | ---------------- |
| `directions-panel/` | `DirectionsPanel` | Problem statement tabs (Description / Solutions / Editorial) |
| `editor-panel/` | `EditorPanel` | Monaco, language select, Run / Reset / Submit, code-save banner |
| `output-panel/` | `OutputPanel` | Testcase + Test Result tabs (`ProblemOutputPanel` behavior) |
| `chat-panel/` | `ChatPanel` | Chat + Notes tabs (formerly sidebar chat) |

### Route integration

- [ ] `apps/app/app/problems/[slug]/page.tsx` — fetch bundle (unchanged), render nav header + **`ProblemWorkspacePage`** (new thin client wrapper) or compose `WorkspaceShell` with four panels fed problem props.
- [ ] Pass `problemId`, `starterCode`, `testCases`, `learningNotes`, problem detail props from page → panel roots.

### Behavior parity (no product changes)

- [ ] Run / Submit / Monaco / output tabs behave as today.
- [ ] Chat streaming, history, message UI unchanged (paths only).
- [ ] Notes tab unchanged.
- [ ] Problem tabs (description, solutions, editorial) unchanged.

---

## Target file structure

```txt
apps/app/features/problem-workspace/
  shell/
    workspace-shell.tsx       # ResizablePanelGroup layout; composes four panel roots
    shell-panel.tsx           # ShellPanel({ children, className? })

  directions-panel/
    components/
      directions-panel.tsx          # NEW root — replaces ProblemDetail left orchestration
      directions-tabs.tsx           # ← problem-tabs.tsx (rename)
      directions-description-tab.tsx # ← problem-description-tab.tsx (rename)
      directions-left-pane.tsx      # ← problem-detail-left-pane.tsx (rename; or fold into directions-panel.tsx)
      example-item.tsx              # ← components/example-item.tsx
      hint-item.tsx                 # ← components/hint-item.tsx
      problem-solution.tsx          # ← components/problem-solution.tsx (or directions-solution.tsx)
    lib/
      parse-editorial.ts            # ← parse-editorial.ts (feature root)
      problem-detail-helpers.ts     # ← problem-detail-helpers.ts (shared parsers; or lift to feature lib/)
      problem-detail-types.ts       # ← problem-detail-types.ts

  editor-panel/
    components/
      editor-panel.tsx              # NEW root — editor chrome + actions (from problem-workspace.tsx editor half)
      monaco-editor.tsx             # ← monaco-solution-edtor.tsx (rename fix typo)
      workspace-code-status-banner.tsx
      json-fallback.tsx             # ← components/json-fallback.tsx (no-starter fallback)
    hooks/
      use-problem-workspace.ts      # ← problem-workspace/hooks/ (or split: editor hook + shared run state — see Open Questions)
    queries/
      parse-workspace-code-error.ts
      use-save-workspace-code-mutation.ts
      use-workspace-code-query.ts
      workspace-code-api.ts
      workspace-code-errors.ts
      workspace-code-keys.ts
    utils/
      format-testcase-input-fields.ts
      merge-saved-drafts.ts
      run-target.ts
      workspace.ts
    lib/
      types.ts                      # ← problem-workspace/types.ts

  output-panel/
    components/
      output-panel.tsx              # NEW root — ← problem-output-panel.tsx
      testcase-panel.tsx
      test-result-panel.tsx
      testcase-field-blocks.tsx

  chat-panel/
    components/
      chat-panel.tsx                # NEW root — ← chat-notes-tabs.tsx (rename)
      chat-shell.tsx                # ← chatbot/components/chat-shell.tsx
      chat-input.tsx
      message-list.tsx
      message.tsx
      message-thinking.tsx
      message-actions.tsx
      problem-notes.tsx             # ← components/problem-notes.tsx
    hooks/
      use-problem-chat.ts           # ← chatbot/hooks/
    actions/
      problem-chat.actions.ts       # ← chatbot/actions/
    lib/
      message-list-utils.ts
      parse-problem-chat-error.ts
      parse-problem-chat-stream-request.ts
      problem-chat-api.ts
      problem-chat-errors.ts
      problem-chat-keys.ts
      problem-chat-server.ts
      problem-chat-stream-server.ts
      problem-chat-types.ts
      problem-chat-ui-messages.ts

  lib/                              # feature-wide shared (cross-panel)
    client-test-run.ts              # ← client-test-run.ts (used by editor run + output display)

  components/                       # DEPRECATED — delete after migration
    (empty or re-export shims until imports updated)

  # DELETE after migration
  components/problem-detail.tsx
  components/expandable-sidebar-chat.tsx
  components/problem-workspace/problem-workspace.tsx
  chatbot/                            # entire tree moved to chat-panel/
```

---

## File migration map (current → target)

| Current path | Target path | Notes |
| ------------ | ----------- | ----- |
| `components/workspace-shell.tsx` | `shell/workspace-shell.tsx` | Wire real panel roots |
| *(new)* | `shell/shell-panel.tsx` | `children` wrapper |
| `components/problem-detail-left-pane.tsx` | `directions-panel/components/directions-left-pane.tsx` | |
| `components/problem-tabs.tsx` | `directions-panel/components/directions-tabs.tsx` | Description / Solutions / Editorial |
| `components/problem-description-tab.tsx` | `directions-panel/components/directions-description-tab.tsx` | |
| `components/example-item.tsx` | `directions-panel/components/example-item.tsx` | |
| `components/hint-item.tsx` | `directions-panel/components/hint-item.tsx` | |
| `components/problem-solution.tsx` | `directions-panel/components/problem-solution.tsx` | |
| `parse-editorial.ts` | `directions-panel/lib/parse-editorial.ts` | |
| `problem-detail-helpers.ts` | `directions-panel/lib/problem-detail-helpers.ts` | shared parsers |
| `problem-detail-types.ts` | `directions-panel/lib/problem-detail-types.ts` | |
| `components/problem-workspace/problem-workspace.tsx` | **split** → `editor-panel/components/editor-panel.tsx` + shell | Remove inner SplitLayout |
| `components/problem-workspace/monaco-solution-edtor.tsx` | `editor-panel/components/monaco-editor.tsx` | Rename export `MonacoEditor` |
| `components/problem-workspace/workspace-code-status-banner.tsx` | `editor-panel/components/workspace-code-status-banner.tsx` | |
| `components/json-fallback.tsx` | `editor-panel/components/json-fallback.tsx` | |
| `components/problem-workspace/hooks/use-problem-workspace.ts` | `editor-panel/hooks/use-problem-workspace.ts` | Coordinates run → output |
| `components/problem-workspace/queries/*` | `editor-panel/queries/*` | |
| `components/problem-workspace/utils/*` | `editor-panel/utils/*` | |
| `components/problem-workspace/types.ts` | `editor-panel/lib/types.ts` | |
| `components/problem-workspace/problem-output-panel.tsx` | `output-panel/components/output-panel.tsx` | Export `OutputPanel` |
| `components/problem-workspace/testcase-panel.tsx` | `output-panel/components/testcase-panel.tsx` | |
| `components/problem-workspace/test-result-panel.tsx` | `output-panel/components/test-result-panel.tsx` | |
| `components/problem-workspace/testcase-field-blocks.tsx` | `output-panel/components/testcase-field-blocks.tsx` | |
| `chatbot/**` | `chat-panel/**` | Same internal structure |
| `components/chat-notes-tabs.tsx` | `chat-panel/components/chat-panel.tsx` | Export `ChatPanel` |
| `components/problem-notes.tsx` | `chat-panel/components/problem-notes.tsx` | |
| `client-test-run.ts` | `lib/client-test-run.ts` | Shared by editor + output |
| `components/problem-detail.tsx` | **DELETE** | Replaced by `WorkspaceShell` + panels |
| `components/expandable-sidebar-chat.tsx` | **DELETE** | Replaced by shell right column |
| `components/problem-slug-nav-header.tsx` | **keep** at `components/problem-slug-nav-header.tsx` | Used by `features/problem-slug-nav/`; out of shell scope |

---

## Component responsibilities

### `WorkspaceProvider` / `useWorkspace()`

- Lives in `shell/workspace-provider.tsx`.
- **Input:** `WorkspaceData` (server-fetched problem bundle from `[slug]/page.tsx`).
- **Owns:** `useProblemWorkspace` return value (editor run state, output tab state, drafts) — shared by `EditorPanel` and `OutputPanel` via context.
- Panels read `{ data, workspace }` from `useWorkspace()`; no prop drilling through `WorkspaceShell`.

```tsx
type WorkspaceContextValue = {
  data: WorkspaceData;
  workspace: ReturnType<typeof useProblemWorkspace>;
};
```

- `ProblemWorkspace` (route colocated client) = `WorkspaceProvider` + `WorkspaceShell` + four panel roots — wired from `app/problems/[slug]/page.tsx`.

### `ShellPanel`

```tsx
type ShellPanelProps = {
  children: React.ReactNode;
  className?: string;
};
```

- Full-height flex column; `min-h-0 overflow-hidden`.
- No title bar in production (dummy demo titles removed).

### `WorkspaceShell`

```tsx
type WorkspaceShellProps = {
  directions: React.ReactNode;
  editor: React.ReactNode;
  output: React.ReactNode;
  chat: React.ReactNode;
  autoSaveId?: string;
};
```

- Owns resizable layout only; no problem data fetching.

### `DirectionsPanel`

- Props: `problem`, `examples`, `hints`, `solutions`, `tags` (same as today’s `ProblemDetail` left side).
- Renders `DirectionsTabs` → description / solutions / editorial.
- Parsing (`problemRow`, tags) moves here or into `directions-panel/lib/`.

### `EditorPanel`

- Props: `problemId?`, `starterCode`, `testCases?`, plus run/output callbacks or shared workspace hook context.
- Monaco + language dropdown + Run / Reset / Submit + `WorkspaceCodeStatusBanner`.
- **Does not** render output tabs (those live in `OutputPanel`).

### `OutputPanel`

- Props: `testCases`, `activeTab`, `onTabChange`, `lastAction`, `lastRunOutcome` (from workspace hook).
- Renders testcase / test result tabs (today’s `ProblemOutputPanel`).

### `ChatPanel`

- Props: `problemId?`, `learningNotes?`, `initialChatData?`.
- Renders Chat | Notes tabs; `ChatShell` + `ProblemNotes`.

---

## Layout diagram

```txt
┌──────────────────────────────────────────────────────────────────┐
│ ProblemSlugNavHeader                                              │
├───────────────┬──────────────────────────────┬───────────────────┤
│ DirectionsPanel│ EditorPanel                  │ ChatPanel          │
│ (tabs)         │ (Monaco + actions)           │ (chat | notes)     │
│                ├──────────────────────────────┤                    │
│                │ OutputPanel                  │                    │
│                │ (testcase | test result)     │                    │
└───────────────┴──────────────────────────────┴───────────────────┘
        ▲                  ▲                           ▲
   shell/WorkspaceShell — ResizablePanelGroup (horizontal + vertical)
   each pane wrapped in ShellPanel
```

---

## System boundaries

| Layer | Path | Notes |
| ----- | ---- | ----- |
| Feature UI | `apps/app/features/problem-workspace/` | This refactor |
| Route | `apps/app/app/problems/[slug]/page.tsx` | Thin; passes bundle to shell |
| Chat BFF | `apps/app/app/api/problems/[problemId]/chat/...` | Unchanged |
| API | `apps/api` problem chat, catalog | Unchanged |
| Design system | `@repo/design-system/components/ui/resizable` | Do not fork |

---

## Out of scope (this pass)

- Vote persistence API for chat messages.
- Submit / judge pipeline (Submit stays placeholder).
- Mobile / collapsed panel UX (optional follow-up).
- Renaming `apps/app/components/split-layout.tsx` usages outside problem-workspace.
- Moving `problem-slug-nav-header.tsx` into `problem-slug-nav` feature folder.

---

## Migration strategy (recommended order)

1. Add `shell/shell-panel.tsx` + move `workspace-shell.tsx`; accept slot props.
2. Create panel folders; **move files** with re-exports at old paths (temporary shims) OR update imports in one PR.
3. Wire `DirectionsPanel`, `EditorPanel`, `OutputPanel`, `ChatPanel` into `WorkspaceShell`.
4. Wire `WorkspaceProvider` from `app/problems/[slug]/problem-workspace.tsx`; panels consume `useWorkspace()`.
5. Migrate real UI into panel folders per migration map.
6. Delete `ProblemDetail`, `ExpandableSidebarChat`, `problem-workspace.tsx`, `chatbot/`, app `SplitLayout` imports in this feature.
7. `pnpm typecheck` + manual test Run + chat on a problem page.

---

## Acceptance criteria

- [ ] Spec registered in [00-index.md](./00-index.md).
- [ ] Four panel folders exist with files per migration map.
- [ ] `ShellPanel` accepts `children` only.
- [ ] `WorkspaceShell` uses design-system `ResizablePanelGroup` (no `SplitLayout`, no `ExpandableSidebarChat`).
- [ ] Chatbot code lives under `chat-panel/` only.
- [ ] Problem tabs live under `directions-panel/` only.
- [ ] Monaco lives under `editor-panel/` only.
- [ ] Output tabs live under `output-panel/` only.
- [ ] `/problems/[slug]` renders full workspace with behavior parity.
- [ ] `pnpm typecheck` passes for `apps/app`.

---

## Architecture decisions (resolved)

| Question | Decision |
| -------- | -------- |
| Workspace state | **`WorkspaceProvider`** at shell level; `useProblemWorkspace` runs inside provider; panels use **`useWorkspace()`** |
| Data wiring | **`WorkspaceData`** passed from `[slug]/page.tsx` into provider; panel UI stays placeholder until file moves complete |
| Renames | **Approved** — `monaco-editor`, `OutputPanel`, `DirectionsPanel`, `EditorPanel`, `ChatPanel` |
| Nav header | **Leave** `problem-slug-nav-header.tsx` in `problem-workspace/components/` for this refactor |
| Chat prefetch | **Deferred** — not in this slice |
| Cross-panel lib | **`lib/client-test-run.ts`** at feature root (unchanged) |

---

## Open questions

*(None blocking — see Architecture decisions above.)*

---

## Implementation prompt for agents

Implement **workspace refactor** per this spec and [01-design-system.md](./01-design-system.md). Start from `shell/` + panel folder moves; preserve chat and run behavior. Do not add product features. Update [progress-tracker.md](../progress-tracker.md) when done. Run `pnpm typecheck` from `apps/app`.
