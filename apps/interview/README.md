# AI Interview Coach (`apps/interview`)

Next.js app for personalized mock interviews. Dev server on port **3012**.

## Quick start

```sh
# From repo root
pnpm install
pnpm dev:interview   # apps/app (:3010) + apps/interview (:3012)

# Or interview app only
cd apps/interview && pnpm dev
```

Open [http://localhost:3012](http://localhost:3012) (landing) or [http://localhost:3012/interview](http://localhost:3012/interview) (prototype flow).

## Docs

- [docs/AGENTS.md](./docs/AGENTS.md) — agent entry point
- [docs/prd.md](./docs/prd.md) — product requirements

## Status

Static UI prototype — five MVP screens with mock content. No auth, database, or AI yet.
