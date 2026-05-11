# Product Requirements Document: Modern LeetCode-Style Practice Platform

| Field | Value |
|--------|--------|
| **Product** | Coding practice platform (LeetCode-style clone, v2) — codename **codedrill** |
| **Implementation repo** | `codedrill` (this repo) — Turborepo + pnpm monorepo, primary app: `apps/app` (see §6.1) |
| **Reference repo** | `leetcode-clone-youtube` (legacy tutorial — UX/feature reference only, see §6) |
| **Document status** | Draft |
| **Last updated** | 2026-05-10 |

---

## 1. Executive summary

This PRD defines a **modernized successor** to the legacy tutorial application: same core user journey (discover problems → read statement → write code → validate → track progress) but built on **current frameworks**, a **real content and grading model**, and **safe, scalable code execution**. The legacy `leetcode-clone-youtube` repo remains the **UX and feature reference**; the v2 implementation lives in **this monorepo (`codedrill`)**, primarily in `apps/app`, with shared functionality in `packages/*` and the judge as its own app (see §6.1 and §9).

**Primary bet:** Ship a trustworthy **run / submit** loop with **server-side or sandboxed judging** before adding social or advanced gamification.

---

## 2. Problem statement

The baseline app demonstrates the loop well for learning but has structural limits:

- **Problems and tests** live in TypeScript modules and ship with the frontend; adding content requires a deploy.
- **Submission** uses `new Function` in the browser to execute user code against bundled handlers—fine for a demo, **unsafe and non-portable** for a real product (no isolation, no multi-language path, easy to abuse).
- **Stack age:** Next.js 13 Pages, patterns that predate App Router and modern data-fetching conventions.
- **Progress** is partially stored in Firestore (`solvedProblems`) but the catalog and “truth” of tests stay in code.

**Opportunity:** Rebuild the same mental model with a **database-backed catalog**, **isolated judge**, and **clear API boundaries** so the product can grow (more problems, languages, optional paywall) without re-architecting.

---

## 3. Vision

A fast, accessible place to practice coding problems with **reliable automated feedback**, clear statements, optional video explanations, and **durable progress**—without the fragility of client-only evaluation.

---

## 4. Goals and non-goals

### 4.1 Goals

| ID | Goal |
|----|------|
| G1 | Preserve the **core loop**: catalog → problem → editor → run (samples) → submit (full suite) → outcome + progress. |
| G2 | **Decouple content from deploys** via DB, CMS, or build-time MDX pipeline (choose one in §9). |
| G3 | **Replace in-browser `eval`/`new Function`** with a documented, rate-limited execution path (sandbox or dedicated worker). |
| G4 | **Modern application shell:** current Next.js (App Router), strict TypeScript, CI, lint/format, environment-based config. |
| G5 | **Auth + persistence:** signed-in users have submissions and completion state tied to their account. |
| G6 | **Polish:** keyboard-friendly modals, sensible empty/loading/error states, dark theme parity with baseline where applicable. |

### 4.2 Non-goals (initial releases)

- Full **global competitive** features (live contests, anti-cheat, public rating systems).
- **Native mobile apps** (responsive web is enough initially).
- **Arbitrary user-uploaded problems** without moderation (can be P2).
- Supporting **every** programming language on day one (start with one or two; see §12).

---

## 5. Users and personas

| Persona | Needs |
|---------|--------|
| **Practitioner** | Filter/browse problems, run and submit code, see failures clearly, resume later. |
| **Returning user** | See solved/attempted state, stable sessions, preferences (font, theme). |
| **Content owner (you)** | Add/edit problems and tests without touching app source for each change. |

---

## 6. Baseline inventory (legacy reference repo: `leetcode-clone-youtube`)

> This section describes the **legacy tutorial codebase** used as the UX/feature reference. It is **not** the layout of *this* repo (`codedrill`). See §6.1 for the current monorepo.

Use this for migration and parity checks.

| Area | Legacy behavior |
|------|------------------|
| **Framework** | Next.js 13, **Pages** router (`src/pages`). |
| **Problems** | Static map in `src/utils/problems/index.ts` (e.g. `two-sum`, `reverse-linked-list`, …). |
| **Problem routes** | `getStaticPaths` / `getStaticProps` on `src/pages/problems/[pid].tsx`; `handlerFunction` serialized with `.toString()` for props. |
| **Workspace** | `react-split`: statement panel + CodeMirror playground (`@uiw/react-codemirror`, JavaScript). |
| **Run / submit** | Client-side: user snippet parsed, `new Function` to get callback, compared via per-problem `handlerFunction` (Node `assert`-style failures surfaced in toasts). |
| **Auth** | Firebase Auth; modals (`Login`, `Signup`, `ResetPassword`); `react-firebase-hooks`. |
| **Progress** | On successful submit, Firestore `users/{uid}` field `solvedProblems` updated with `arrayUnion(pid)`. |
| **UI state** | Recoil for auth modal atom; `react-toastify`; confetti on success. |
| **Other** | Timer, settings modal, font size in `localStorage`, Topbar/Navbar, problems table with difficulty/category/solution (YouTube). |

**Explicit technical debt to retire in v2:** client execution of arbitrary user JavaScript; bundling secret or hidden tests only as obscured client logic (if any); coupling of “grader” and “statement” in one TS module per problem.

---

## 6.1 Current repository (`codedrill` monorepo)

This is the actual workspace v2 will be built in. Treat it as the source of truth for paths, package names, and tooling.

| Area | Reality |
|------|---------|
| **Layout** | Turborepo + pnpm workspaces. Workspace globs: `apps/*`, `apps/security-lab/*`, `packages/*` (see `pnpm-workspace.yaml`). |
| **Root tooling** | `turbo` (build/dev/test/analyze), **Biome 2** + **Ultracite** for lint/format (`pnpm check`, `pnpm fix`), `vitest`, TS 5.9, Node ≥ 18, `pnpm@10`. No ESLint/Prettier. |
| **Primary product app** | `apps/app` — Next.js **16** (App Router), React 19, Tailwind 4. Currently scaffolded as `neon-auth` starter and is the intended home for the practice platform UI (rename when product naming is confirmed). |
| **Sibling apps (labs / experiments)** | `apps/ai-chatbots`, `apps/neon-jwt-api`, `apps/storybook`, `apps/system-design-lab`, `apps/testing-lab`, `apps/with-nest`, `apps/with-optimization`, `apps/with-solid`, `apps/with-sse`. Not part of P0 unless explicitly pulled in (e.g. judge could live as its own `apps/*` service). |
| **Shared packages** | `@repo/database` + `@repo/prisma-neon` (Prisma on Neon Postgres), `@repo/auth`, `@repo/design-system`, `@repo/rate-limit`, `@repo/security`, `@repo/observability`, `@repo/schemas`, `@repo/ai`, `@repo/analytics`, `@repo/email`, `@repo/feature-flags`, `@repo/storage`, `@repo/notifications`, `@repo/payments`, `@repo/webhooks`, `@repo/seo`, `@repo/internationalization`, `@repo/collaboration`, `@repo/next-config`, `@repo/typescript-config`. Prefer reusing these over adding new packages. |
| **DB workflow** | `pnpm migrate` runs `prisma format && prisma generate && prisma db push` from `packages/database`. New schema lives there, not inside an app. |

**Implications for v2 implementation:**

- The practice platform UI/API ships **inside `apps/app`** (or a renamed sibling app), not at the repo root.
- Catalog, problems, test cases, submissions, and user state belong in **`packages/database`** Prisma schema; consumed by app via `@repo/database`.
- Auth uses **`@repo/auth`** (with Neon Auth in `apps/app` today) — pick one provider and remove the Firebase assumptions from §6.
- Rate limiting and security headers come from **`@repo/rate-limit`** + **`@repo/security`**; do not roll new ones.
- The **judge** should be its own `apps/*` service (e.g. `apps/judge`) so it can be deployed and scaled independently and CPU/memory-capped per §9.

---

## 7. Functional requirements

### 7.1 P0 — Must ship (“v1 modern clone”)

| ID | Requirement | Acceptance criteria (examples) |
|----|-------------|--------------------------------|
| **F1** | **Problem catalog** | Lists title, difficulty, categories/tags; loads from API or DB (not only static imports). Pagination or virtual scroll for large lists. |
| **F2** | **Problem detail** | Route per stable `slug`/`id`; 404 for unknown ids; statement renders markdown (code blocks, lists); optional embedded video URL preserved from baseline behavior. |
| **F3** | **Editor** | Syntax highlighting for chosen language(s); monospaced font; font size preference persisted; basic undo/redo via editor. |
| **F4** | **Run** | Executes against **visible** sample cases; shows stdout/stderr or structured diff per case; completes within documented timeout for samples. |
| **F5** | **Submit** | Executes against **full** test suite server-side or in sandbox; returns pass/fail/wrong answer/TLE/RTE with **no** raw stack traces to end users (map to friendly codes). |
| **F6** | **Auth** | Sign up, sign in, sign out, password reset (parity with baseline); session available to server for protected routes/APIs. |
| **F7** | **Progress** | Persist at minimum: `solved` / `attempted` per problem per user; optional store of last submitted code. Catalog reflects status. |
| **F8** | **Rate limiting** | Run and submit endpoints limited per user/IP to mitigate abuse. |

### 7.2 P1 — Strong follow-ons

| ID | Requirement | Notes |
|----|-------------|--------|
| **F9** | **Admin or import path** | CLI or UI to upsert problems + tests; validate schema before publish. |
| **F10** | **Discuss or hints** | Threaded comments or collapsible hints per problem. |
| **F11** | **Streaks / goals** | Lightweight engagement (optional). |
| **F12** | **Collections** | Curated lists (“Blind 75”, “Arrays week 1”). |

### 7.3 P2 — Later

- Company tags, mock interview mode, teams, billing.

---

## 8. Non-functional requirements

| Category | Requirement |
|----------|-------------|
| **Security** | User code never runs with full Node privileges on shared tenancy without isolation; no secrets in client bundles; CSRF/cookie rules documented for same-site APIs. |
| **Performance** | Catalog LCP target defined per environment (e.g. p75 &lt; 2.5s on simulated 4G); judge p95 latency budget (e.g. &lt; 10s for reference problems). |
| **Reliability** | Submissions idempotent or deduplicated by client token; structured error responses for judge outages. |
| **Accessibility** | WCAG 2.1 AA for catalog and chrome; editor has accessible name; focus trap in modals. |
| **Observability** | Structured logs for judge failures; metrics for submit volume, error rate, latency histograms. |

---

## 9. Technical direction (recommended defaults)

Decisions here should be copied into an Architecture Decision Record (ADR) set as they are finalized.

| Topic | Direction |
|-------|-----------|
| **App framework** | Next.js **App Router** (Next 16 already in `apps/app`), React 19, TypeScript strict. |
| **API** | App Router Route Handlers in `apps/app` for catalog/run/submit; optional internal HTTP boundary to the judge service. Avoid tRPC unless a clear need emerges. |
| **Database** | **Postgres on Neon via `@repo/database` (Prisma)** — already wired. New tables: `problems`, `test_cases`, `submissions`, `user_problem_state` (plus existing user/auth tables). Migrations live in `packages/database`. |
| **Auth** | Use **`@repo/auth`** as the single source. `apps/app` is currently on Neon Auth; standardize the rest of the product on the same provider rather than reintroducing Firebase. |
| **Client state** | Minimize global state; URL for filters; reach for Zustand/Jotai only where needed. No Recoil. |
| **Editor** | CodeMirror 6 or Monaco; match baseline shortcuts where possible. |
| **Judge** | Separate service (recommended: new `apps/judge` in this monorepo) running user code in an isolated process: Docker sidecar, Fly Machines, or Cloud Run job. **Documented** CPU/time/memory caps; called from `apps/app` over HTTP with a shared secret. |
| **Rate limiting / security** | Use `@repo/rate-limit` and `@repo/security` from `apps/app` route handlers; do not implement ad-hoc limiters. |
| **Content** | **Preferred:** problems and public samples in DB (`packages/database`); hidden tests only on server. **Alternative:** MDX in repo + build step importing into DB (still no `new Function` for grading). |

**Migration note:** Existing `src/utils/problems/*.ts` definitions should be **exported** via a one-time script into JSON/SQL seed format (statement markdown, starter code, public + hidden test vectors, reference solution for internal validation only).

---

## 10. Phased delivery plan

| Phase | Scope | Exit criteria |
|-------|--------|----------------|
| **0** | Tooling baseline (Turborepo, pnpm, Biome/Ultracite, Vitest, TS strict) — **already in place**. Ensure CI on `pnpm check` + `turbo build` + `turbo test`; env template current. | Green CI on `main`. |
| **1** | Practice UI shell in `apps/app`: App Router layout, catalog page reading from a **seed API** or static JSON. | Deployable stub with 5+ problems listed. |
| **2** | Prisma schema in `packages/database` (`problems`, `test_cases`, `submissions`, `user_problem_state`); `apps/app` catalog + problem page read from DB via `@repo/database`; auth via `@repo/auth`. | No hardcoded problems map; signed-in users persist `solved`/`attempted`. |
| **3** | Stand up `apps/judge` (or chosen sandbox) + run/submit Route Handlers in `apps/app`; migrate seed problems from legacy repo. | All P0 functional reqs F4–F5 met in staging with load-test smoke. |
| **4** | Progress sync, polish, a11y pass; remove any legacy-style assumptions from §6 that snuck into code. | P0 complete; baseline parity on “solved” UX. |
| **5** | P1 items per roadmap priority. | First admin/import path live. |

---

## 11. Success metrics

| Metric | Definition |
|--------|------------|
| **Activation** | % of new accounts that open a problem and hit **Run** at least once within 24h. |
| **Core engagement** | Median problems **submitted** per active user per week. |
| **Judge health** | Submit **5xx** rate &lt; 0.5%; p95 judge duration under budget (§8). |
| **Content velocity** | Median time from “draft problem” to “published” (once F9 exists). |

---

## 12. Open questions

1. **Languages for v1:** JavaScript only (closest to baseline) vs add Python from the start.
2. **Judge hosting:** self-managed containers vs managed sandbox vendor (cost vs control).
3. **Monetization:** none vs “Pro” (more problems, video, discuss) vs course bundle.
4. **YouTube:** remain first-class “Solution” column vs generic “Resources” links.
5. **Product app naming:** keep `apps/app` (currently the Neon Auth starter) and grow it into the practice platform, or rename it (e.g. `apps/practice`) and reserve `apps/app` for something else.
6. **Judge placement:** new `apps/judge` service in this monorepo vs a third-party sandbox vendor.

---

## 13. Appendix: parity checklist (baseline → v2)

- [ ] Problem list with status, title, difficulty, category, solution link.
- [ ] Split workspace: description + editor + test case UI.
- [ ] Starter code + function name constraint (or full-file mode for non-JS).
- [ ] Toast feedback for success/failure; optional celebration UX (confetti optional).
- [ ] Login-gated submit; persisted solved state.
- [ ] Timer (if retained: define whether it affects scoring or is cosmetic only).
- [ ] Settings: font size, modal for preferences.

---

*End of PRD.*
