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

## Job Analysis System (implemented)

| Action | HTTP | Purpose |
|--------|------|---------|
| `generateJobAnalysis` | `POST /interview/job-analyses/generate` | AI extraction from job description (no save) |
| `saveJobAnalysis` | `POST /interview/job-analyses` | Insert `interview_job_analyses` row |
| `getLatestJobAnalysis` | `GET /interview/job-analyses/me` | Latest analysis for user (`null` if none) |
| `getJobAnalysis` | `GET /interview/job-analyses/:jobAnalysisId` | Analysis by id (owner only) |

**Generate body:** `{ jobDescription, jobUrl?, companyName?, roleTitle? }`

**Save body:** `{ jobDescription, jobUrl?, ...JobAnalysisPayload }` — `companyName`, `roleTitle`, `roleSummary`, `requiredSkills`, `niceToHaveSkills`, `seniorityLevel`, `likelyInterviewCategories`, `mustProve`, `hiddenExpectations`, `interviewSignals`, `suggestedQuestionAngles`

**Response (saved / GET):** payload fields plus `id`, `jobDescription`, `jobUrl`, `createdAt`, `updatedAt`

**Auth:** `ProblemsUserGuard` → Clerk `sub` as `user_id`.

**Interview app:** Server Actions in `features/job-analysis/actions.ts`; page `/job-analysis`.
