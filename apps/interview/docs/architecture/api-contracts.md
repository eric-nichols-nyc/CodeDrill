# API / Action Contracts

Interview Coach BFF calls **`apps/api`** with Clerk Bearer JWT (`apiAuthHeaders()`).

## Profile System (implemented)

| Action | HTTP | Purpose |
|--------|------|---------|
| `generateProfile` | `POST /interview/profiles/generate` | AI extraction from resume text (no save) |
| `saveProfile` | `POST /interview/profiles` | Insert resume row + candidate profile |
| `getLatestProfile` | `GET /interview/profiles/me` | Latest profile for user (`null` if none) |
| `getProfile` | `GET /interview/profiles/:profileId` | Profile by id (owner only) |
| `updateProfile` | `PATCH /interview/profiles/:profileId` | Replace structured fields |

**Auth:** `ProblemsUserGuard` → Clerk `sub` as `user_id`.

**Interview app:** Server Actions in `features/profile/actions.ts`; page `/profile`.

Related: [database.md](./database.md), [data-contracts.md](./data-contracts.md).
