# Feature: problem-example-images

## Goal

Allow each problem **statement example** to include an optional illustration (e.g. a spiral-matrix traversal diagram) shown in the workspace Directions panel above the input/output blocks. Admins attach images via a **public-folder path** when creating or editing a problem. Learners see the image inline with the example, similar to LeetCode-style problem statements.

## Reference

- [01-design-system.md](./01-design-system.md) — UI folder layout, SOLID, tokens.
- [15-problem-visualizer.md](./15-problem-visualizer.md) — related visual learning; visualizer is interactive and slug-gated; example images are static and per-example.
- [00-index.md](./00-index.md) — register this file when created.

## User story

As a **learner**, I want diagrams on problem examples when the concept is easier to grasp visually, so that I understand input/output without parsing text alone.

As an **admin**, I want to add an optional image path to each example row in `NewProblemForm`, so that published problems can show illustrations like spiral traversal grids.

## MVP decision: public folder

**MVP stores a path, not a file upload.**

- Admin adds image files under `apps/app/public/` (e.g. `public/images/examples/spiral-matrix-1.png`).
- Example field `imageUrl` holds the web path: `/images/examples/spiral-matrix-1.png`.
- Validation: must start with `/` and must not start with `//` (blocks protocol-relative URLs).
- Next.js serves these as static assets — **no** `images.remotePatterns` needed for MVP.

Workflow: commit image to repo → set path in admin form → preview in form → learners see it in workspace.

## Advanced stage (deferred — do not implement until requested)

When ready for S3 (or similar):

- Presigned upload endpoint + admin file picker in `NewProblemForm`.
- Store full `https://` CDN URL in `image_url` (extend validation to allow `https://` in addition to `/…` paths).
- Add `next.config` `images.remotePatterns` for the bucket host.
- Optional: migrate existing public paths or keep both schemes.

Leave this section as documentation only until the user expands scope.

## Requirements

### DB / API

- [x] Add optional nullable `image_url` and `image_alt` to `problem_examples` (migration `0003`).
- [x] Extend `ProblemExampleDto` with optional `imageUrl` and `imageAlt`.
- [x] Persist and return both fields in create, update, and detail fetch.
- [x] Validate `imageUrl` when present: public path starting with `/` (not `//`).

### Admin UI

- [x] Extend `problemExampleSchema` and `CreateProblemBody` example shape.
- [x] **`NewProblemForm`** — per example row: optional **Image path** + **Alt text** + live preview (`ExampleImagePreview`).
- [x] Round-trip on edit via `detailToFormValues` and `buildProblemPayload`.
- [x] Mirror fields in `AdminProblemDetail` read-only view.

### Workspace UI

- [x] Extend `ExampleItem` to render optional image **above** input/output via `ExampleImage`.
- [x] Respect `imageAlt`; fallback: `Example {n} illustration`.
- [x] Broken/missing image: hide gracefully; input/output still shown.

### Content / seed (follow-up)

- [ ] Add Spiral Matrix example PNGs under `public/images/examples/` and set paths on seeded rows.

## System boundaries

| Layer | Path | Notes |
| ----- | ---- | ----- |
| Feature UI — workspace | `…/directions-panel/components/example-item.tsx`, `example-image.tsx` | Display |
| Feature UI — admin | `…/admin/components/new-problem-form.tsx`, `example-image-preview.tsx`, `admin-problem-detail.tsx` | Form + preview |
| Admin lib | `features/admin/lib/{create-problem-schema,build-problem-payload,problem-form-values}.ts` | Validation + mapping |
| API | `apps/api/src/problems/` | DTO + service |
| Database | `apps/api/src/database/schema.ts` | `problem_examples.image_url`, `image_alt` |
| Static assets | `apps/app/public/images/examples/` | MVP image files |

## API

### Types

```ts
type ProblemExample = {
  input: string;
  output: string;
  explanation?: string;
  sortOrder?: number;
  imageUrl?: string;   // MVP: /images/… public path
  imageAlt?: string;
};
```

## Out of scope (MVP)

- S3 upload, presigned URLs, CDN configuration.
- `next.config` remote image patterns (only needed for external URLs in advanced stage).
- AI problem generation producing images.
- Markdown or rich text inside examples.

## Acceptance criteria

- [x] Migration `0003` applied; existing examples unchanged.
- [x] Admin can set optional image path + alt on an example in **`NewProblemForm`**; saves and reloads on edit.
- [x] Workspace Directions tab shows image above input/output when `imageUrl` is set.
- [x] Invalid path rejected on admin submit; broken path at runtime does not break the example card.
- [x] Spec registered in [00-index.md](./00-index.md).
- [ ] `pnpm db:migrate` run locally; `pnpm typecheck` passes.

## Implementation prompt for agents

MVP is **public-folder paths only**. Do not add S3 until the user asks.

1. Run `pnpm db:migrate` in `apps/api` after pulling migration `0003`.
2. Add PNGs under `apps/app/public/images/examples/` as needed.
3. Set paths in admin example rows (e.g. `/images/examples/spiral-matrix-ex1.png`).
