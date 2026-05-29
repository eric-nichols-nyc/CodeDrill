# Feature: workspace state management

## Goal

Reduce **internal prop drilling** inside the problem workspace by consuming the existing `WorkspaceProvider` / `useWorkspace()` hook deeper in each panel subtree. The page→provider boundary stays a single `WorkspaceData` handoff; no new global store (Zustand/Jotai) unless a future need appears outside the provider tree.

This is a **developer-experience refactor** — no product behavior changes.

## Reference

- [01-design-system.md](./01-design-system.md) — feature folder layout, SOLID, hooks vs components.
- [11-workspace-refactor.md](./11-workspace-refactor.md) — panel roots already call `useWorkspace()`; this spec finishes flattening inside each panel.
- [prd.md](../../prd.md) § Technical direction — “Minimize global state; URL for filters; add Zustand/Jotai only where justified.”
- [07-problem-chat-ui.md](./07-problem-chat-ui.md) — chat server state stays in TanStack Query + `useProblemChat`; do not move chat runtime into workspace context.

## User story

As a developer working on the problem workspace, I want panel components to read shared state from `useWorkspace()` instead of long prop chains, so that I can change directions, output, or editor wiring without updating intermediate wrappers.

---

## Current state (baseline)

### Provider stack

```txt
page.tsx (RSC)
  └─ ProblemWorkspace
       └─ WorkspaceProvider(data: WorkspaceData)
            │  useProblemWorkspace({ problemId, starterCode, testCases })
            └─ WorkspaceShell (layout slots only — no data props)
                 ├─ DirectionsPanel
                 ├─ EditorPanel
                 ├─ OutputPanel
                 └─ ChatPanel
```

### Context shape

```ts
type WorkspaceContextValue = {
  data: WorkspaceData;                              // immutable server bundle
  workspace: ReturnType<typeof useProblemWorkspace>; // editor drafts, run, output tabs, code save
};
```

**`WorkspaceData`** (`shell/lib/workspace-data.ts`): `problemId?`, `problem`, `examples`, `hints`, `starterCode`, `testCases?`, `learningNotes?`, `solutions`, `tags?`

### What already works

| Panel root | Reads context? | Notes |
| ---------- | -------------- | ----- |
| `EditorPanel` | ✓ `data` + `workspace` | Target pattern for other panels |
| `DirectionsPanel` | ✓ `data` only | Normalizes then drills 12 props to `DirectionsContent` |
| `OutputPanel` | ✓ `data` + `workspace` | Thin adapter; drills 5 props to `ProblemOutputPanel` |
| `ChatPanel` | ✓ `data` only | Drills `problemId` / `learningNotes` to tab children |

### Prop-drilling hotspots

| Path | Props drilled | Priority |
| ---- | ------------- | -------- |
| `DirectionsPanel` → `DirectionsContent` | 12 (`p`, lists, show flags, `editorial`, `tags`, …) | **High** |
| `DirectionsContent` → `DescriptionTab` | 10 (subset of above) | **High** |
| `OutputPanel` → `ProblemOutputPanel` | 5 (`activeTab`, `lastAction`, `lastRunOutcome`, `onTabChange`, `testCases`) | **Medium** |
| `ChatPanel` → `ChatShell` / `ProblemNotes` | 2 (`problemId`, `learningNotes`) | **Low** |

Chat **subtree** (`SignedInChatShell` → header/list/input) uses local container→presentational props — **out of scope** (correct pattern; not workspace drilling).

---

## Requirements

### Principles

- [ ] **No new dependencies** — React Context + existing hooks only.
- [ ] **No product changes** — tabs, run/submit, chat, notes, visualizer behave identically.
- [ ] **Provider boundary unchanged** — `page.tsx` still passes one `WorkspaceData` object into `WorkspaceProvider`.
- [ ] **Chat runtime stays isolated** — threads, messages, streaming remain in `useChatSessions` / `useProblemChat` / TanStack Query.
- [ ] **Presentational leaves stay testable** — optional `*View` components may keep props when used from Storybook/tests; production path uses context or a colocated selector hook.

### Slice 1 — Output panel (smallest)

- [ ] `ProblemOutputPanel` calls `useWorkspace()` directly for `data.testCases` and `workspace.{activeTab, setActiveTab, lastAction, lastRunOutcome}`.
- [ ] `OutputPanel` becomes `ShellPanel` + `<ProblemOutputPanel />` only (mirror `EditorPanel`).
- [ ] Remove the 5-prop public interface from `ProblemOutputPanel` (or keep optional overrides for tests only if needed).

### Slice 2 — Directions panel (largest win)

- [ ] Add **`useDirectionsData()`** hook under `directions-panel/hooks/`:
  - Reads `useWorkspace().data`
  - Owns normalization currently in `DirectionsPanel` (`problemRow`, `parseProblemTags`, show flags, example/hint lists, `editorial`)
  - Returns a stable, typed view model (see Types below)
- [ ] **`DirectionsContent`** calls `useDirectionsData()` — **zero data props** from parent.
- [ ] **`DescriptionTab`**, **`ProblemSolutionTab`**, **`EditorialTab`** either:
  - call `useDirectionsData()` directly, or
  - receive only the minimal slice they need from `DirectionsContent` via composition (prefer direct hook if it removes 10-prop interface)
- [ ] **`DirectionsPanel`** is `ShellPanel` + `<DirectionsContent />` only.
- [ ] Move `problemRow` / `pickConstraints` helpers into `directions-panel/lib/` or keep in hook file if private.

### Slice 3 — Chat panel (optional, trivial)

- [ ] `ChatShell` reads `useWorkspace().data.problemId` internally.
- [ ] `ProblemNotes` reads `useWorkspace().data.learningNotes` internally.
- [ ] `ChatPanel` tab shell only; no `problemId` / `learningNotes` props passed down.

### Cleanup (same PR or follow-up)

- [ ] Trim or wire unused `useProblemWorkspace` return fields if still dead after refactor: `consoleEntries`, `totalChars`, `workspaceCodeLoadError`, `workspaceCodeSaveError`, `clearWorkspaceCodeSaveError`, `isLoadingSavedCode`.
- [ ] Update tests that mount `ProblemOutputPanel` or directions tabs with drilled props.

---

## System boundaries

| Layer | Path | Notes |
| ----- | ---- | ----- |
| Context owner | `features/problem-workspace/shell/workspace-provider.tsx` | Unchanged API |
| Runtime hook | `features/problem-workspace/editor-panel/hooks/use-problem-workspace.ts` | Unchanged surface unless cleanup slice |
| Directions selector | `features/problem-workspace/directions-panel/hooks/use-directions-data.ts` | **New** |
| Output UI | `features/problem-workspace/output-panel/components/` | Slice 1 |
| Chat UI | `features/problem-workspace/chat-panel/components/` | Slice 3 optional |
| Route | `apps/app/app/problems/[slug]/` | No changes expected |

**Out of scope:** `apps/api`, new Zustand store, URL-synced tab state, splitting `WorkspaceProvider` into two contexts, chat message state.

---

## Types

### `DirectionsViewModel` (new, in `directions-panel/lib/` or hook file)

```ts
import type {
  ProblemEditorial,
  ProblemRow,
  ProblemSolutionRow,
  ProblemTag,
} from "./problem-detail-types";

export type DirectionsViewModel = {
  p: ProblemRow;
  problem: unknown;
  examples: unknown;
  hints: unknown;
  solutions: ProblemSolutionRow[];
  exampleList: unknown[];
  hintList: unknown[];
  showDescription: boolean;
  showConstraints: boolean;
  showDifficulty: boolean;
  editorial: ProblemEditorial | null;
  tags: ProblemTag[];
};
```

---

## Proposed file structure

```txt
apps/app/features/problem-workspace/
  shell/
    workspace-provider.tsx          # unchanged
    lib/workspace-data.ts           # unchanged

  directions-panel/
    hooks/
      use-directions-data.ts        # NEW — normalization + useWorkspace().data
    components/
      directions-panel.tsx          # ShellPanel + DirectionsContent only
      directions-content.tsx        # tabs; no data props
      description-tab.tsx           # useDirectionsData() or minimal props
      editorial-tab.tsx
      problem-solution-tab.tsx
    lib/
      problem-detail-helpers.ts     # existing parsers
      problem-detail-types.ts
      parse-editorial.ts
      directions-view-model.ts      # optional — export DirectionsViewModel

  output-panel/
    components/
      output-panel.tsx              # ShellPanel + ProblemOutputPanel
      problem-output-panel.tsx      # useWorkspace() internally

  chat-panel/
    components/
      chat-panel.tsx                # tab shell only (slice 3)
      chat-shell.tsx                # reads problemId from context (slice 3)
      problem-notes.tsx             # reads learningNotes from context (slice 3)
```

---

## Component responsibilities

### `useDirectionsData()`

- Single place for problem-row normalization and visibility flags.
- Memoize derived lists/flags from `data` reference.
- Must not import from editor/output/chat panels (directions-only).

### `DirectionsPanel`

- Layout chrome only: `ShellPanel` → `DirectionsContent`.

### `ProblemOutputPanel`

- Owns output tabs UI; reads runtime tab state from `workspace`, static cases from `data`.

### `ChatShell` / `ProblemNotes` (slice 3)

- Read `problemId` / `learningNotes` from context at entry; internal chat hooks unchanged.

---

## State ownership (after refactor)

| State | Owner | Access |
| ----- | ----- | ------ |
| Server problem bundle | `WorkspaceProvider.data` | `useWorkspace().data` |
| Editor drafts, run, output tab | `useProblemWorkspace` | `useWorkspace().workspace` |
| Directions view model | `useDirectionsData` | directions subtree only |
| Chat threads / messages | TanStack Query + `useProblemChat` | chat subtree only |
| Panel resize | `ResizablePanelGroup` + `autoSaveId` localStorage | shell only |
| Directions/chat sub-tab selection | local `Tabs` `defaultValue` | component-local (unchanged) |

---

## Out of scope (this pass)

- Zustand, Jotai, Redux, or second React context.
- URL query params for active tab (directions / output / chat).
- Splitting `{ data, workspace }` into two providers.
- Moving chat runtime into workspace context.
- Changes to `useProblemWorkspace` behavior (run/submit/save) beyond dead-field cleanup.
- Nav header catalog props (`ProblemSlugNavHeaderConnected`) — outside workspace tree.

---

## Acceptance criteria

- [ ] No panel root receives problem data props from `ProblemWorkspace` except `WorkspaceProvider data={…}`.
- [ ] `DirectionsContent` has no 12-prop data interface.
- [ ] `ProblemOutputPanel` has no 5-prop adapter from `OutputPanel`.
- [ ] `useDirectionsData()` colocates all directions normalization (no duplicate `problemRow` in panel + content).
- [ ] Chat, run, submit, visualizer, and notes behave as before (manual smoke on one problem page).
- [ ] Spec registered in [00-index.md](./00-index.md).
- [ ] `pnpm typecheck` passes for `apps/app`.
- [ ] Existing tests updated or passing (`use-problem-workspace.test.tsx`, any panel tests).

---

## Implementation order

1. **Slice 1** — output panel (~1 file meaningful change).
2. **Slice 2** — `useDirectionsData` + flatten directions (~4–5 files).
3. **Slice 3** — chat panel props (optional, ~2 files).
4. **Cleanup** — dead `useProblemWorkspace` exports, test fixes.

Ship slices as separate commits on branch `state-management` if helpful for review.

---

## Implementation prompt for agents

Implement **workspace state management** per this spec and [01-design-system.md](./01-design-system.md).

**Do:**

- Expand `useWorkspace()` consumption downward; add `useDirectionsData()` for directions normalization.
- Keep `WorkspaceProvider` and `useProblemWorkspace` behavior unchanged unless removing confirmed-dead return fields.
- Preserve chat isolation (TanStack Query + AI SDK hooks).

**Do not:**

- Add Zustand/Jotai or a second context.
- Change product UX, API calls, or route data fetching.
- Refactor chat message list/header prop wiring (local composition is fine).

**Verify:** `pnpm typecheck` from `apps/app`; smoke-test problem page — Description/Solutions/Editorial tabs, Run → Test Result tab, chat send, notes tab.

**Docs:** Update [progress-tracker.md](../progress-tracker.md) when each slice ships.
