# Product Requirements Document: CodeDrill (LeetCode-style practice platform)

| Field | Value |
|--------|--------|
| **Product** | **CodeDrill** — coding practice platform (modern successor to a LeetCode-style tutorial baseline) |
| **Implementation repo** | `codedrill` (this repo) — Turborepo + pnpm monorepo; primary UI: `apps/app`; practice API: `apps/api` (see §6.1) |
| **Reference repo** | `leetcode-clone-youtube` (legacy tutorial — UX/feature reference only, see §6) |
| **Document status** | Living document (synced to repo) |
| **Last updated** | 2026-05-14 |

---

## 1. Executive summary

This PRD defines the **CodeDrill** product: the same core user journey as the legacy baseline (discover problems → read statement → write code → validate → track progress), implemented on **current frameworks**, a **database-backed catalog**, and a path toward **safe server-side judging**. The legacy `leetcode-clone-youtube` repo remains a **UX and feature reference**; implementation lives in **this monorepo**.

**Where the codebase is today:** The **problem catalog and rich problem definitions** are served from **`apps/api`** (NestJS, Postgres on Neon, **Drizzle ORM**, **Better Auth**). The **Next.js 16** app in **`apps/app`** renders the marketing landing page, **problems list** and **problem-by-slug workspace** (split layout, Monaco editor, output panel), and **admin** flows that proxy to the API. **Run** executes **sample tests in the browser** (structured evaluation of user JavaScript — still not an isolated judge). **Submit** is **placeholder UI only** (no full-suite execution or persistence wired from the workspace yet). **Per-problem AI chat** HTTP endpoints exist on the API (user messages stored; assistant replies to be added server-side).

**Primary bet (unchanged):** Ship a trustworthy **run / submit** loop with **server-side or sandboxed judging** before leaning on social or heavy gamification.

---

## 2. Problem statement

The baseline tutorial app demonstrates the loop for learning but has structural limits that CodeDrill is meant to overcome:

- **Problems and tests** coupled to the frontend-only world — CodeDrill has moved **catalog + schema** to the API and Neon Postgres; content can be managed via API/admin without redeploying static maps for every change.
- **Unsafe evaluation** — the product still uses **in-browser execution** for **Run** today; **Submit** and **hidden tests** must move to a **documented, rate-limited, isolated** path (see §9).
- **Stack age (baseline)** — addressed for v2: **App Router**, strict TypeScript, Biome/Ultracite, Vitest, CI-oriented scripts.
- **Progress truth** — Drizzle schema includes **`problem_progress`**, **`submissions`**, and related tables; **HTTP handlers for submissions from the app are not fully wired** end-to-end yet.

**Ongoing opportunity:** Finish **judge + submit**, unify **end-user auth** between the Neon Auth–powered app and Better Auth–protected API where needed, and harden rate limits on execution endpoints.

---

## 3. Vision

A fast, accessible place to practice coding problems with **reliable automated feedback**, clear statements, optional explanations and tutor affordances, and **durable progress** — without relying on client-only evaluation for scored submits.

---

## 4. Goals and non-goals

### 4.1 Goals

| ID | Goal |
|----|------|
| G1 | Preserve the **core loop**: catalog → problem → editor → run (samples) → submit (full suite) → outcome + progress. |
| G2 | **Decouple content from deploys** via API + DB (in progress: catalog and definitions live in **`apps/api`** schema). |
| G3 | **Replace in-browser grading for Submit** with a documented, rate-limited execution path (sandbox or dedicated worker). **Run** may remain client-only for samples for longer if clearly labeled. |
| G4 | **Modern application shell:** Next.js App Router, strict TypeScript, CI, lint/format, environment-based config. |
| G5 | **Auth + persistence:** signed-in users have submissions and completion state tied to their account (schema ready; wiring in flight). |
| G6 | **Polish:** keyboard-friendly flows, sensible empty/loading/error states, dark theme support via shared design system. |

### 4.2 Non-goals (initial releases)

- Full **global competitive** features (live contests, anti-cheat, public rating systems).
- **Native mobile apps** (responsive web is enough initially).
- **Arbitrary user-uploaded problems** without moderation (can be P2).
- Supporting **every** programming language on day one (start with one or two; see §12).

---

## 5. Users and personas

| Persona | Needs |
|---------|-------|
| **Practitioner** | Filter/browse problems, run and submit code, see failures clearly, resume later. |
| **Returning user** | See solved/attempted state, stable sessions, preferences (font, theme). |
| **Content owner** | Add/edit problems and tests via **admin UI** / API without shipping new static modules for each change. |

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

**Explicit technical debt to retire in v2:** client execution of arbitrary user JavaScript for **scored Submit**; bundling hidden tests only as obscured client logic; coupling of “grader” and “statement” in one TS module per problem (largely addressed for **storage**; **Run** still evaluates in-browser today).

---

## 6.1 Current repository (`codedrill` monorepo)

This section is the **source of truth** for what exists in the repo **today**.

### Layout and tooling

| Area | Reality |
|------|---------|
| **Workspace** | `pnpm-workspace.yaml`: `apps/*`, `packages/*` (optional `apps/security-lab/*` if present in a branch). Root **`docs/`** may exist as documentation content but is not always a pnpm workspace package — prefer `apps/api/README.md` for API setup. |
| **Root tooling** | `turbo` (build/dev/test/analyze), **Biome** + **Ultracite** (`pnpm check`, `pnpm fix`), **Vitest**, TypeScript **5.9**, Node **≥ 18**, **pnpm 10**. |
| **Primary UI** | **`apps/app`** — Next.js **16** (App Router), React **19**, Tailwind **4**, port **3010** in dev. Package name remains **`neon-auth`** historically; product-facing name is **CodeDrill**. Uses **Neon Auth** (`@neondatabase/neon-auth-next`, `neon-js`) for sign-in/account flows and **`@repo/prisma-neon` / `@repo/database`** where the template wires Prisma. |
| **Practice API** | **`apps/api`** — NestJS, **Better Auth** (email/password), **Drizzle ORM** on **Neon Postgres**. pnpm package name **`neon-jwt-api`**; default port **3030**. See **`apps/api/README.md`**. |
| **Other apps under `apps/`** | Examples and tooling: `ai-chatbots`, `storybook`, `system-design-lab`, `testing-lab`, `with-nest`, `with-solid`, `with-sse`. Treat as **labs** unless promoted into the product boundary. |
| **Shared packages** | `@repo/database` + `@repo/prisma-neon` (Prisma — largely template/auth-adjacent usage in the app), `@repo/design-system`, `@repo/auth`, `@repo/rate-limit`, `@repo/security`, `@repo/observability`, `@repo/schemas`, `@repo/ai`, `@repo/analytics`, `@repo/email`, `@repo/feature-flags`, `@repo/storage`, `@repo/notifications`, `@repo/payments`, `@repo/webhooks`, `@repo/seo`, `@repo/internationalization`, `@repo/collaboration`, `@repo/next-config`, `@repo/typescript-config`. Prefer reusing over new packages. |
| **DB workflows** | **Practice catalog:** Drizzle in `apps/api` — `pnpm --filter neon-jwt-api db:push` (schema in `apps/api/src/database/schema.ts`; reference SQL in `apps/api/sql/practice-platform.sql`). **Prisma (template):** `pnpm migrate` at root runs Prisma against `packages/database`. |

### Practice domain (Drizzle / `apps/api`)

Tables include (non-exhaustive): **`problems`**, **`tags`** / **`problem_tags`**, **`problem_examples`**, **`test_cases`**, **`starter_code`**, **`problem_hints`**, **`problem_solutions`**, **`problem_learning_notes`**, **`submissions`**, **`submission_test_results`**, **`problem_progress`**, **`problem_chat_thread`**, **`problem_chat_message`**. REST surface today centers on **`/problems`** (catalog, by slug, details, CRUD with access guard) and **`/problems/:problemId/chat/messages`** (see API README).

### Next app integration

| Concern | Reality |
|---------|---------|
| **Fetching catalog / detail** | Server Components call **`NEON_JWT_API_URL`** (default `http://localhost:3030`) with forwarded **`Cookie`** and optional **`x-internal-problems-secret`** (`INTERNAL_PROBLEMS_SECRET`) — see `apps/app/lib/problems/fetch-problems-list.ts` and `fetch-problem-by-slug.ts`. |
| **Admin** | Next **Route Handlers** under `apps/app/app/api/admin/problems/*` proxy to the Nest API for create/update and detail fetch. |
| **Workspace** | **Run:** `client-test-run.ts` + `use-problem-workspace` evaluate the active starter snippet against **sample** cases in the browser. **Submit:** **not implemented** (placeholder messages only). |
| **Editor** | **Monaco** (`@monaco-editor/react`) primary; CodeMirror packages also present in dependencies. |
| **Timer** | `TimerProvider` wraps the problem-by-slug page (cosmetic / UX continuity with baseline). |
| **Problem chat UI** | Client chat components under `features/problem-detail/chatbot/` intended to use the API thread/message routes. |

### Implications

- **Catalog and problem JSON** should continue to live in **`apps/api`** + Neon, not static maps in the Next app.
- **Judge** should still be a **separate deployable** (e.g. future `apps/judge` or managed sandbox) for CPU/memory caps and isolation; **not present in the repo yet**.
- **Auth alignment** is an active design area: **Neon Auth** in the Next app vs **Better Auth** sessions for **`/problems`** — document cookie/CORS and user-id mapping when wiring user-scoped catalog and submissions from the browser.

---

## 7. Functional requirements

### 7.1 P0 — Must ship (“v1 modern clone”)

| ID | Requirement | Acceptance criteria (examples) | Status (2026-05) |
|----|-------------|--------------------------------|------------------|
| **F1** | **Problem catalog** | Lists title, difficulty, tags; loads from API/DB; scales to many rows. | **Partial** — list from `GET /problems`; polish pagination/virtualization as needed. |
| **F2** | **Problem detail** | Route per stable `slug`; 404 for unknown; statement from API; examples/test metadata from API. | **Partial** — `/problems/[slug]` + API bundle; continue hardening parsing and empty states. |
| **F3** | **Editor** | Syntax highlighting; monospaced font; font size preference if required by parity. | **Partial** — Monaco wired; preferences as needed. |
| **F4** | **Run** | Executes against **visible** sample cases; structured per-case results; timeout UX. | **Partial** — client-side Run on samples; document limits; consider server path later. |
| **F5** | **Submit** | Full suite **server-side or sandbox**; friendly status codes; no raw stacks to users. | **Not done** — UI placeholder; schema supports submissions. |
| **F6** | **Auth** | Sign up, sign in, sign out, session for protected APIs. | **Partial** — Neon Auth in app; Better Auth on API; unify for user-scoped features. |
| **F7** | **Progress** | `solved` / `attempted` per user per problem; catalog reflects status. | **Not done** — `problem_progress` exists; end-to-end wiring TBD. |
| **F8** | **Rate limiting** | Run/submit endpoints limited per user/IP. | **Partial** — use `@repo/rate-limit` when exposing public judge/submit routes. |

### 7.2 P1 — Strong follow-ons

| ID | Requirement | Notes |
|----|-------------|--------|
| **F9** | **Admin or import path** | **In progress** — admin UI + BFF routes calling Nest `POST/PUT /problems`. |
| **F10** | **Discuss or hints** | Hints/solutions/learning notes in schema; discuss threads TBD. |
| **F11** | **Streaks / goals** | Lightweight engagement (optional). |
| **F12** | **Collections** | Curated lists (“Blind 75”, …). |

### 7.3 P2 — Later

- Company tags, mock interview mode, teams, billing.

---

## 8. Non-functional requirements

| Category | Requirement |
|----------|-------------|
| **Security** | User code must not run with full Node privileges on shared tenancy for **Submit**; no secrets in client bundles; CSRF/cookie rules documented for same-site API calls. |
| **Performance** | Catalog LCP targets per environment; judge p95 latency budget once live. |
| **Reliability** | Submissions idempotent or deduplicated by client token; structured errors for judge outages. |
| **Accessibility** | WCAG 2.1 AA for catalog and chrome; editor has accessible name; focus management in modals. |
| **Observability** | Structured logs for judge failures; metrics for submit volume, error rate, latency. |

---

## 9. Technical direction (recommended defaults)

Decisions here should be copied into ADRs as they are finalized.

| Topic | Direction |
|-------|-----------|
| **UI** | Next.js **App Router** (`apps/app`), React 19, TypeScript strict. |
| **Practice API** | **NestJS** in **`apps/api`**: Better Auth, Drizzle, Neon. Next app consumes it over HTTP (cookies and/or internal secret for server-side fetches). |
| **Catalog DB** | **Postgres on Neon** — practice tables owned by **`apps/api`** Drizzle schema. |
| **Template / Prisma** | **`packages/database`** remains for Prisma-based template features; **do not** duplicate practice tables in Prisma unless consolidating intentionally. |
| **Auth** | Short term: **Better Auth** owns session for **`/problems`**; **Neon Auth** owns Next app account UX — **align user identity** (or consolidate on one stack) before production user progress. |
| **Client state** | Minimize global state; URL for filters; add Zustand/Jotai only where justified. |
| **Editor** | Monaco primary; keep CodeMirror optional/alternate where useful. |
| **Judge** | Separate service (e.g. future **`apps/judge`**) with CPU/time/memory caps; called from API or Next over HTTP with a shared secret. **Not implemented.** |
| **Rate limiting / security** | Use **`@repo/rate-limit`** and **`@repo/security`** on exposed execution and admin routes. |
| **Run vs Submit** | **Run** may stay client for rapid feedback on samples; **Submit** must use server/sandbox and hidden tests only on the server. |

**Migration note:** Legacy `src/utils/problems/*.ts` style definitions can be **seeded** into Neon via scripts or admin payloads (statement markdown, starter code, public + hidden test vectors, reference solution for internal QA only).

---

## 10. Phased delivery plan

| Phase | Scope | Exit criteria | Status |
|-------|--------|----------------|--------|
| **0** | Tooling baseline (Turborepo, pnpm, Biome/Ultracite, Vitest, TS strict). | Green CI on `main`. | **Done** |
| **1** | Practice UI shell: layout, catalog, problem page from **real API**. | Deployable app listing problems from Neon API. | **Largely done** |
| **2** | Drizzle schema + Nest problems API; admin create/edit; chat thread persistence. | Problems manageable without app redeploy; chat messages API usable. | **In progress** |
| **3** | **`apps/judge`** (or vendor sandbox) + submit pipeline + API persistence; wire workspace Submit. | F5 met in staging; hidden tests never shipped to client. | **Not started** |
| **4** | Progress sync, polish, a11y pass. | F7 + catalog status chips; baseline parity on “solved” UX. | **Not started** |
| **5** | P1 roadmap items. | First-class hints/collections/etc. as prioritized. | **Future** |

---

## 11. Success metrics

| Metric | Definition |
|--------|------------|
| **Activation** | % of new accounts that open a problem and hit **Run** at least once within 24h. |
| **Core engagement** | Median problems **submitted** per active user per week. |
| **Judge health** | Submit **5xx** rate under 0.5%; p95 judge duration under budget (§8). |
| **Content velocity** | Median time from “draft problem” to “published” (admin path). |

---

## 12. Open questions

1. **Languages for v1:** JavaScript only vs add Python from the start.
2. **Judge hosting:** self-managed containers vs managed sandbox vendor (cost vs control).
3. **Monetization:** none vs “Pro” vs course bundle.
4. **YouTube / video:** first-class “Solution” column vs generic “Resources” links.
5. **Package rename:** keep `neon-auth` / `neon-jwt-api` names or rename to `app` / `api` for clarity.
6. **Auth model:** single provider vs documented bridge between Neon Auth (Next) and Better Auth (API) for the same user.
7. **Client Run long-term:** keep for samples only vs move behind a lightweight server endpoint.

---

## 13. Appendix: parity checklist (baseline → CodeDrill)

- [x] Problem list (title, difficulty, tags from API).
- [x] Split workspace: description + editor + output tabs (console / test cases / results).
- [x] Starter code from API; Run against sample cases (client-side).
- [ ] Starter parity: toasts/confetti (optional); full **Submit** with persisted outcome.
- [ ] Login-gated submit aligned with API session; persisted **solved** state in DB driving catalog.
- [x] Timer provider on problem page (define whether cosmetic vs scored).
- [ ] Settings: font size, global preferences modal (as needed).

---

*End of PRD.*
