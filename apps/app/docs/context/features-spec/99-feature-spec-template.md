# Feature: \<feature-name\>

## Goal

[One paragraph: what this feature does and why.]

## Reference

- [01-design-system.md](./01-design-system.md) — UI folder layout, SOLID, tokens.
- [00-index.md](./00-index.md) — register this file when created.

## User story

As a [role], I want [capability], so that [outcome].

## Requirements

### [Area 1]

- [ ] …

### [Area 2]

- [ ] …

## System boundaries

| Layer | Path | Notes |
| ----- | ---- | ----- |
| Feature UI | `apps/app/features/<name>/` | |
| BFF (if any) | `apps/app/app/api/...` | |
| API (if any) | `apps/api/src/...` | |
| Database (if any) | `apps/api/src/database/schema.ts` | |

## API (if applicable)

### Endpoints

| Method | Path | Auth | Body | Response |
| ------ | ---- | ---- | ---- | -------- |
| | | | | |

### Types

```ts
// shared shape between API and app lib/types.ts
```

## Proposed file structure

```txt
apps/app/features/<feature-name>/
  components/
  hooks/
  lib/          # types, fetchers, query keys
  utils/        # optional pure helpers
```

## Component / module responsibilities

### `ComponentName`

- …

## Routes (thin)

- `apps/app/app/.../page.tsx` — [what the route fetches and composes]

## Out of scope (this pass)

- …

## Acceptance criteria

- [ ] Feature folder matches design-system layout.
- [ ] Spec registered in [00-index.md](./00-index.md).
- [ ] …
- [ ] `pnpm typecheck` passes for `apps/app` (and `apps/api` if touched).

## Implementation prompt for agents

Implement feature `<feature-name>` per this spec and `01-design-system.md`. …
