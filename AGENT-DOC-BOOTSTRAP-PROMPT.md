# Bootstrap prompt — spec-driven agent documentation

Copy everything inside the fenced block below into a **new Cursor Agent chat** in another project. Fill in the bracketed placeholders first, or ask the agent to infer them from the codebase.

---

## Copy from here ↓

```
Set up a spec-driven documentation system for AI agents (Cursor) in this project, modeled on the CodeDrill pattern below. Adapt paths and stack details to THIS repo — do not copy CodeDrill paths blindly.

## Goal

Give Cursor agents a predictable workflow:
1. Read AGENTS.md + context files before implementing
2. Implement against per-feature specs (not invented behavior)
3. Update a live progress tracker after every meaningful change
4. Enforce scope and conventions via .cursor/rules/

Separate **requirements** (context/) from **learn-by-reading notes** (reference/).

---

## Project-specific inputs (fill these in first, or infer from the repo)

- **Project name:** [e.g. MyApp]
- **Primary app path:** [e.g. apps/web/ or src/]
- **Other in-scope paths:** [e.g. apps/api/, packages/ui/ — or "single app, no monorepo"]
- **Out-of-scope paths to exclude from Cursor index:** [e.g. apps/storybook/, legacy/]
- **Stack:** [e.g. Next.js 15, React, TanStack Query, Tailwind, shadcn]
- **Feature folder convention:** [e.g. src/features/<name>/ with components/, hooks/, utils/]
- **Route convention:** [e.g. thin pages in app/ or pages/]
- **Dev commands:** [e.g. pnpm dev, pnpm typecheck, pnpm test]
- **Existing product doc (if any):** [e.g. docs/prd.md or README — link it]

---

## File tree to create

```
[REPO_ROOT]/
  AGENTS.md                          # short monorepo/repo scope stub
  .cursorignore                      # exclude out-of-scope paths from index
  .cursor/rules/
    project-scope.mdc                # alwaysApply: scope constraints
    [app-name].mdc                   # globs: primary app — read AGENTS, update tracker
    prefers-hooks.mdc                # optional: extract logic into use-* hooks

[APP_ROOT]/
  AGENTS.md                          # stub → points to docs/AGENTS.md
  docs/
    AGENTS.md                        # main agent playbook (read order, defaults, commands)
    prd.md                           # living product requirements (or link to existing)
    context/
      project-overview.md            # goals, users, core flows
      architecture.md                # stack, boundaries, auth, storage, invariants
      ui-context.md                  # design system, tokens, layout patterns
      code-standards.md              # TS/framework/API conventions
      ai-workflow-rules.md           # scoping, protected files, doc sync rules
      progress-tracker.md            # LIVE STATE: current goal, in progress, completed
      features-spec/
        00-index.md                  # registry of all features
        01-design-system.md          # shared UI/folder rules for all features
        99-feature-spec-template.md  # copy when starting a new feature
        NN-<feature-name>.md         # one file per feature (added over time)
    reference/
      README.md                      # "learn by reading" — NOT requirements
      00-index.md                    # map of reference notes
      agents-cursorrules-feature-specs.md  # explains how the doc system works
```

Adjust `[APP_ROOT]` if this is a single-package repo (e.g. put everything under `docs/` at repo root).

---

## What each layer does

| Layer | Purpose |
|-------|---------|
| **AGENTS.md chain** | Tells agents WHERE to read and HOW to behave |
| **.cursor/rules/** | Auto-injects those rules when scope matches |
| **context/** | Source of truth for WHAT to build |
| **features-spec/** | One spec per feature + registry index |
| **progress-tracker.md** | What's active NOW + log of what shipped |
| **reference/** | Human learning notes — agents must NOT treat as requirements |

**Conflict resolution:** feature spec → architecture/standards → prd.md. Reference notes never override specs.

---

## AGENTS.md content requirements

### 1. Repo root `AGENTS.md` (short)
- List in-scope paths only
- Point to main entry: `[APP_ROOT]/docs/AGENTS.md`
- Mention `.cursor/rules/project-scope.mdc` and `.cursorignore`

### 2. App stub `[APP_ROOT]/AGENTS.md` (short)
- Pointer only: read `docs/AGENTS.md` and `docs/context/progress-tracker.md` before implementing

### 3. Main `[APP_ROOT]/docs/AGENTS.md` (full playbook)
Include these sections:
- **Read order** (numbered list of context files agents must load at task start)
- **Scope** (which packages/folders own UI vs API vs shared UI)
- **Commands** (dev, build, typecheck, test)
- **Implementation defaults** (spec-driven, no invented behavior, feature folder layout, thin routes)
- **Protected files** (generated UI, vendor, etc.)
- **Progress tracker rules** — REQUIRED after every meaningful change:
  - Read at task start (Current Goal, In Progress)
  - Update Completed, Current Goal, In Progress, Next Up, Open Questions, Session Notes when done
- **New features workflow** — copy template → register in 00-index → note in tracker

---

## Cursor rules to create

### `.cursor/rules/project-scope.mdc`
```yaml
---
description: Restrict agent to in-scope paths only
alwaysApply: true
---
```
- List allowed paths
- NEVER search/edit out-of-scope paths unless user explicitly expands
- Align with `.cursorignore`

### `.cursor/rules/[app-name].mdc`
```yaml
---
description: [App] — read agent context and keep progress-tracker in sync
globs: [APP_ROOT]/**/*
alwaysApply: false
---
```
At task start: read `docs/AGENTS.md` + `progress-tracker.md`
While implementing: feature folder layout per `01-design-system.md`; new features get spec + index row
Before done: update `progress-tracker.md`; run typecheck when types/routes touched

### `.cursor/rules/prefers-hooks.mdc` (optional)
When refactoring React: extract reusable logic into `use-*` hooks colocated under the feature.

---

## `.cursorignore`
Exclude out-of-scope apps/packages from Cursor's codebase index (gitignore syntax). Same paths as project-scope rule.

---

## Context files — minimum viable content

Create each file with real project facts (inspect the codebase). Use `[TBD]` only where truly unknown.

**progress-tracker.md** sections:
- Current Phase
- Current Goal (one active unit)
- In Progress
- Completed (one line per shipped unit: `area — what shipped`)
- Next Up
- Open Questions
- Architecture Decisions
- Session Notes

**ai-workflow-rules.md** must include:
- Work one feature unit at a time
- Do not invent behavior not in context/specs
- Ambiguity → open question in progress-tracker before coding
- Protected files list
- New feature rule: no code under `features/<name>/` without index entry (spec or **Spec TODO** + tracker line)
- Before next unit: works E2E, architecture intact, tracker updated, build/typecheck passes

**features-spec/00-index.md** — registry table:

| Feature | Spec | App UI | API / BFF | Status |

Seed with:
- Row for `01-design-system.md` (shared)
- One row per existing feature folder you find in the codebase (mark Shipped or Spec TODO)
- Link spec files where they exist

**99-feature-spec-template.md** sections:
Goal, User story, Requirements (checkboxes), System boundaries table, API (if any), Proposed file structure, Component responsibilities, Routes (thin), Out of scope, Acceptance criteria, Implementation prompt for agents

**01-design-system.md** — shared rules for ALL features:
- Folder layout (`components/`, `hooks/`, `utils/`, `lib/`)
- Import paths for UI primitives
- Token/theme rules (no random hex)
- SOLID-ish component boundaries

---

## Workflow: adding a new feature (document this in AGENTS.md and reference/)

1. Copy `99-feature-spec-template.md` → `NN-<feature-name>.md`, fill it in
2. Add row to `features-spec/00-index.md` (Status: Not started / In progress)
3. Set **Current Goal** + **In Progress** in `progress-tracker.md`
4. Implement code under `[APP_ROOT]/features/<name>/` (or project convention)
5. On ship: move line to **Completed** in tracker; update **Status** in index

**Index = permanent map. Tracker = live session state.**

---

## reference/ folder

Create `reference/README.md` explaining:
- `context/` = requirements for agents
- `reference/` = personal learn-by-reading notes
- Agents must NOT treat reference as product requirements

Create `reference/agents-cursorrules-feature-specs.md` explaining how AGENTS.md, Cursor rules, index, and tracker fit together (with a simple diagram if helpful).

---

## Bootstrap task for this session

1. Inspect the repo and fill in all placeholder paths and stack facts
2. Create the full file tree above with real content (not empty stubs where facts are knowable)
3. Inventory existing features under `[APP_ROOT]/features/` (or equivalent) and register them in `00-index.md`
4. Seed `progress-tracker.md` with Current Phase and any known Completed work
5. Do NOT implement product features — documentation scaffolding only
6. Summarize what you created and list any `[TBD]` items I need to fill in

Keep prose concise. Match existing repo tone if docs already exist.
```

## Copy to here ↑

---

## Reference implementation (CodeDrill)

This prompt was extracted from the working setup in this repo:

| Piece | Path |
|-------|------|
| Repo scope stub | `AGENTS.md` |
| App stub | `apps/app/AGENTS.md` |
| Main playbook | `apps/app/docs/AGENTS.md` |
| Feature registry | `apps/app/docs/context/features-spec/00-index.md` |
| Live state | `apps/app/docs/context/progress-tracker.md` |
| How it fits together | `apps/app/docs/reference/agents-cursorrules-feature-specs.md` |
| Cursor rules | `.cursor/rules/monorepo-scope.mdc`, `codedrill-app.mdc`, `prefers-hooks.mdc` |
