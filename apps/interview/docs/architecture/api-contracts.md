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

## Interview Generator / Sessions (implemented)

| Action | HTTP | Purpose |
|--------|------|---------|
| `generateInterviewBlueprint` | `POST /interview/sessions/generate` | AI blueprint preview (no save); latest profile + job analysis |
| `createInterviewSession` | `POST /interview/sessions` | Persist blueprint → playable session (`ready`) |
| `seedInterviewSession` | `POST /interview/sessions/seed` | Dev-only quick session (3 questions) |

**Generate body (optional):** `{ profileId?, jobAnalysisId? }` — defaults to latest for user.

**Create body:** `{ profileId, jobAnalysisId, blueprint: { interviewTitle, estimatedDurationMinutes, categories, questions[] } }` — 5–10 questions; each question has `order`, `category`, `difficulty`, `question`, `expectedSignals`, `followUpOpportunities`.

**Generate response:** `InterviewBlueprintPreview` — ids, title, duration, categories, `questions[]`, `questionCount`.

**Create response:** `{ interviewId, interviewTitle, companyName, roleTitle }`

## Question Player / Interview Sessions (implemented)

| Action | HTTP | Purpose |
|--------|------|---------|
| `getInterviewSession` | `GET /interview/sessions/:interviewId` | Session + ordered questions + answers |
| `startInterviewSession` | `POST /interview/sessions/:interviewId/start` | `ready` → `in_progress` |
| `submitAnswer` | `POST /interview/sessions/:interviewId/questions/:questionId/answer` | Save transcript + `answerMode` |
| `completeInterviewSession` | `POST /interview/sessions/:interviewId/complete` | All questions answered → `completed` |

**Submit body:** `{ transcript, answerMode: "voice" | "text", durationSeconds? }` — transcript min 10 chars trimmed.

**Response:** `InterviewSession` — `id`, `interviewTitle`, `estimatedDurationMinutes`, `questionCount`, `categories`, `status`, `startedAt`, `completedAt`, `questions[]` with optional `answer`.

**Auth:** `ProblemsUserGuard` → Clerk `sub` as `user_id`.

**Interview app:** Server Actions in `features/interview-player/actions.ts`; routes `/interviews/start` (generate → create), `/interviews/[interviewId]/play`, `/interviews/[interviewId]/complete`.
