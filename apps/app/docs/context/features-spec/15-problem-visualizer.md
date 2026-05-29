# Feature: problem-visualizer (SOLID refactor)

## Goal

Render an optional, interactive step-by-step visualizer for a problem at the bottom of the
Solutions tab. Each visualizer is problem-specific, ships its own data and code trace, and is
selected by `slug` via a frontend registry. Availability is gated by a DB boolean
`has_visualizer`. This spec supersedes the original MVP sketch and describes the full
SOLID-structured implementation with per-visualizer sub-folders and annotated layers.

## Reference

- [01-design-system.md](./01-design-system.md) — UI folder layout, SOLID, tokens.
- [11-workspace-refactor.md](./11-workspace-refactor.md) — directions panel / tabs structure.
- [00-index.md](./00-index.md) — registered below.

## User story

As a learner working a problem, I want to step through the algorithm visually (matrix state,
result, bounds, and the active code line), so that I can build intuition for problems that
benefit from step-by-step animation.

## SOLID design rationale

| Principle | Decision |
| --------- | -------- |
| **S** — Single responsibility | Each sub-component owns exactly one display concern; step-generation logic and nav-state live in isolated utils/hooks; the composition root contains no logic. |
| **O** — Open/closed | New visualizers are added by creating a new sub-folder and a single registry entry — no existing files change. |
| **L** — Liskov substitution | Every visualizer satisfies the same `VisualizerComponent` contract (no required props); callers treat all entries identically. |
| **I** — Interface segregation | Sub-components receive only what they display (`activeLine`, `bounds`, `result`, …) — never the full step object. |
| **D** — Dependency inversion | `SpiralMatrixVisualizer` depends on the `useSpiralStepper` abstraction, not raw `useState`; the gate component depends on the `VisualizerRegistry` type, not concrete implementations. |

## Requirements

### DB / API

- [ ] Add boolean `has_visualizer` (default `false`) to the `problems` table (Drizzle migration).
- [ ] Expose `hasVisualizer` on the problem detail bundle (`buildProblemDetails` returns full row).
- [ ] Accept optional `hasVisualizer` on `CreateProblemDto` and persist it in create/update.
- [ ] Enable `has_visualizer = true` for the Spiral Matrix problem row (SQL or Studio).

### Frontend

- [ ] Shared registry + gate at `visualizer/` root.
- [ ] Each visualizer lives in its own sub-folder (`visualizer/<slug>/`).
- [ ] Spiral Matrix visualizer fully decomposed per SOLID file structure below.
- [ ] All components use `@repo/design-system` primitives and semantic tokens (no hardcoded hex).
- [ ] Block + inline SOLID annotations on every module boundary.

## System boundaries

| Layer | Path | Notes |
| ----- | ---- | ----- |
| Feature UI — shared | `apps/app/features/problem-workspace/visualizer/` | Gate, registry, shared types |
| Feature UI — spiral matrix | `apps/app/features/problem-workspace/visualizer/spiral-matrix/` | Full SOLID sub-folder |
| Directions panel | `apps/app/features/problem-workspace/directions-panel/` | Threads `slug` + `hasVisualizer`; renders gate at bottom of `ProblemSolutionTab` |
| BFF | — | None — reuses existing problem detail fetch |
| API | `apps/api/src/problems/` | DTO + service mapping only |
| Database | `apps/api/src/database/schema.ts` | `problems.has_visualizer` boolean |

## API (if applicable)

### Endpoints

| Method | Path | Auth | Body | Response |
| ------ | ---- | ---- | ---- | -------- |
| (reuse) | `GET /problems/:slug` | existing | — | `problem` row now includes `hasVisualizer` |

### Types

```ts
// problem-detail-types.ts — extend ProblemRow
type ProblemRow = {
  // …existing fields
  slug?: string;
  hasVisualizer?: boolean;
};
```

## Proposed file structure

```txt
apps/app/features/problem-workspace/visualizer/
│
│  # [S] Gate: renders nothing unless flag + registry match
│  # [O] New visualizers extend registry only — this file never changes
│  # [D] Depends on VisualizerRegistry type, not concrete visualizers
├── components/
│   └── problem-visualizer.tsx
│
│  # [O/D] Extension point: slug → lazy-loaded VisualizerComponent
├── lib/
│   ├── visualizer-registry.ts
│   └── visualizer-types.ts         # VisualizerComponent contract
│
│  ── Spiral Matrix sub-folder ──────────────────────────────────────
│
│  # [S] Composition root — wires hook output to display components
│  # [D] Depends on useSpiralStepper abstraction, not raw state
spiral-matrix/
├── components/
│   ├── spiral-matrix-visualizer.tsx
│   │
│   │  # [S] Displays matrix grid only
│   │  # [I] Receives (row, col, visited[][]) — not full SpiralStep
│   ├── matrix-grid.tsx
│   │
│   │  # [S] Displays result chip array only
│   │  # [I] Receives number[] — nothing else
│   ├── result-array.tsx
│   │
│   │  # [S] Displays code trace with active-line highlight only
│   │  # [I] Receives (lines: string[], activeLine: number) — not full SpiralStep
│   ├── code-panel.tsx
│   │
│   │  # [S] Displays boundary pointers only
│   │  # [I] Receives Bounds — not full SpiralStep
│   ├── bounds-panel.tsx
│   │
│   │  # [S] Renders prev/next/reset controls only
│   │  # [I] Receives (stepIndex, totalSteps, handlers) — no knowledge of step data
│   └── visualizer-controls.tsx
│
│  # [S] Step-index navigation state + derived booleans only
│  # [D] Exposes stable handler interface; callers don't know about useState
├── hooks/
│   └── use-spiral-stepper.ts
│
│  # [S] Pure step-generation algorithm — no React, no side-effects
│  # [O] Accepts any number[][] input; closed to algorithm changes from display layer
└── utils/
    ├── generate-spiral-steps.ts    # algorithm + SpiralStep shape
    └── spiral-matrix-data.ts       # static matrix + codeLines constants
```

## Component / module responsibilities

### `visualizer-types.ts` (shared)

```ts
// [L] Every visualizer satisfies this contract — no required props.
// Self-contained: each visualizer ships its own data for MVP.
export type VisualizerComponent = React.ComponentType;
```

### `visualizer-registry.ts`

- Maps slug strings to `next/dynamic`-wrapped `VisualizerComponent` values.
- `getVisualizer(slug: string): VisualizerComponent | null`.
- **[O]** Adding a new visualizer = add one registry entry. Nothing else changes.

### `ProblemVisualizer` (gate)

- Props: `{ slug: string; hasVisualizer: boolean }`.
- Returns `null` unless `hasVisualizer` is `true` AND a component is registered for the slug.
- **[D]** Depends on `getVisualizer` — not on any concrete visualizer import.

### `useSpiralStepper` (hook)

```ts
// [S] Owns only step-index state and navigation handlers.
// [D] Consumers receive a stable interface; useState is an implementation detail.
export type UseSpiralStepperReturn = {
  step: SpiralStep;
  stepIndex: number;
  totalSteps: number;
  isFirst: boolean;
  isLast: boolean;
  goPrev: () => void;
  goNext: () => void;
  reset: () => void;
};
```

### `generateSpiralSteps` (util)

- Pure function: `(input: number[][]) => SpiralStep[]`.
- **[S]** No React, no side effects, no module-level globals. Accepts any matrix.
- **[O]** Closed to display-layer changes; open to different matrix inputs via parameter.

### `spiral-matrix-data.ts` (util)

- Exports `SPIRAL_MATRIX` and `SPIRAL_CODE_LINES` constants.
- **[S]** Owns only static data — keeps it out of the algorithm and out of components.

### `MatrixGrid`

- Props: `{ currentRow: number; currentCol: number; visited: boolean[][]; matrix: number[][] }`.
- **[I]** Receives only what it renders — no `SpiralStep`, no direction, no result.

### `ResultArray`

- Props: `{ result: number[] }`.

### `CodePanel`

- Props: `{ lines: string[]; activeLine: number }`.
- **[I]** Decoupled from `SpiralStep` — can be reused by any future code-trace visualizer.

### `BoundsPanel`

- Props: `{ bounds: Bounds }`.

### `VisualizerControls`

- Props: `{ stepIndex: number; totalSteps: number; onPrev: () => void; onNext: () => void; onReset: () => void }`.
- **[I]** No knowledge of what a "step" is — pure navigation UI.

### `SpiralMatrixVisualizer` (composition root)

- `"use client"`, no logic beyond calling `useSpiralStepper` and passing slices to children.
- **[D]** Depends on the hook's return type, not on `useState` directly.
- **[S]** Contains no algorithm, no style decisions, no state beyond what the hook exposes.

### `ProblemSolutionTab` (existing — minor update)

- Accepts an optional `visualizer?: ReactNode` slot and renders it at the bottom.

## Routes (thin)

- `apps/app/app/problems/[slug]/page.tsx` — unchanged. Already passes the full `problem` row
  through `ProblemWorkspace`; `slug` + `hasVisualizer` thread down to the directions panel.

## Architecture decisions

| Decision | Rationale |
| -------- | --------- |
| `CodePanel` stays in `spiral-matrix/components/` | Hoisting it to the shared layer before a second visualizer exists is premature abstraction — we don't know yet whether a future visualizer needs a code trace, or what shape it would take. Extract when two concrete uses exist. |
| Each visualizer gets its own sub-folder | Prevents coupling between unrelated visualizers; each evolves independently and can be deleted cleanly. |
| `VisualizerComponent = React.ComponentType` (no required props) | Each visualizer ships its own data for MVP. Keeping the contract prop-free means the registry and gate never need to know about individual visualizer data shapes (ISP + LSP). |

## Out of scope (this pass)

- Storing visualizer step data / config in the DB (visualizers ship their own data for MVP).
- Admin form UI toggle for `has_visualizer` (set via SQL/Studio initially).
- Visualizers for problems other than Spiral Matrix.
- Animation / auto-play mode.

## Acceptance criteria

- [ ] `problems.has_visualizer` column added via Drizzle migration; `hasVisualizer` flows through `buildProblemDetails`.
- [ ] Spiral Matrix visualizer appears at the bottom of the Solutions tab for that problem and is absent for all others.
- [ ] File structure matches this spec exactly.
- [ ] Every module has block + inline SOLID annotations at its boundary.
- [ ] All sub-components receive only the props they actually render (ISP).
- [ ] `useSpiralStepper` is the sole owner of step-index state; composition root is logic-free.
- [ ] `getVisualizer` is the only import of concrete visualizer components; `ProblemVisualizer` imports nothing else.
- [ ] `pnpm typecheck` passes for `apps/app` and `apps/api`.
- [ ] Spec registered in [00-index.md](./00-index.md).

## Implementation prompt for agents

Implement feature `problem-visualizer` per this spec and `01-design-system.md`.

1. **API / DB** — Add `has_visualizer` boolean column (Drizzle migration), expose it on the
   problem detail bundle, accept it on `CreateProblemDto`, enable it for the Spiral Matrix row.

2. **Shared visualizer layer** — Create `visualizer-types.ts` (`VisualizerComponent` type),
   `visualizer-registry.ts` (slug → `next/dynamic` map, `getVisualizer`), and
   `problem-visualizer.tsx` (gate).

3. **Spiral Matrix sub-folder** — Create each file per the structure above:
   `spiral-matrix-data.ts` → `generate-spiral-steps.ts` → `use-spiral-stepper.ts` →
   leaf display components → composition root `spiral-matrix-visualizer.tsx`.
   Register the slug in the registry.

4. **Wire** — Pass `slug` and `hasVisualizer` from `ProblemWorkspace` down to the directions
   panel; add `visualizer` slot to `ProblemSolutionTab`; render `<ProblemVisualizer>` there.

5. **Annotate** — Add block comments naming the SOLID principle(s) at every module boundary
   and inline comments on non-obvious decisions. Do not add trivial narration comments.
