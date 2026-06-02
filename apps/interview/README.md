# AI Interview Coach (`apps/interview`)

Next.js zone app for personalized mock interviews. Mounted at **`/interview`** (`basePath`).

## Quick start

```sh
# From repo root
pnpm install
pnpm dev:interview   # apps/app (:3010) + apps/interview (:3012/interview)

# Or interview app only
cd apps/interview && pnpm dev
```

Open [http://localhost:3012/interview](http://localhost:3012/interview).

## Docs

- [docs/AGENTS.md](./docs/AGENTS.md) — agent entry point
- [docs/prd.md](./docs/prd.md) — product requirements

## Status

Static UI prototype — five MVP screens with mock content. No auth, database, or AI yet.
