# Feature Spec: AI Problem Form Generation

## Feature name

`ai-problem-form-generation`

## Implementation status

**Last aligned with codebase:** 2026-05-26 (branch `feature/admin-chatbot`).

Most of this feature is already shipped. The original staged plan assumed a greenfield build; the repo skipped the “client-only fake data” slice and went straight to a live API + OpenAI route.

| Area | Status |
| ---- | ------ |
| AI prompt panel (`GenerateProblemFromPrompt`) | **Shipped** |
| Dev sample autofill (`DevAdminProblemFill`) | **Shipped** |
| Form fill on generate (`handleDevFill` → `setValues`) | **Shipped** |
| Review-before-submit (no auto-save) | **Shipped** |
| Empty prompt validation (disabled button) | **Shipped** |
| Loading + error states | **Shipped** |
| Client API helper (`requestGeneratedProblem`) | **Shipped** |
| Next BFF `POST /api/admin/problems/generate` (auth + proxy) | **Shipped** |
| Nest `POST /problems/generate` + OpenAI | **Shipped** |
| Response normalization (`normalizeCreateProblemBody`) | **Shipped** |
| Success message after generate | **Shipped** |
| Dirty-form overwrite confirmation | **Shipped** |
| Prompt max length / character count | **Shipped** |
| Unit tests | **Not shipped** |
| Optional refactor (`useAiProblemDraft` hook, rename panel) | **Not shipped** |

**Remaining work** is Stage 5 tests. OpenAI generation runs on **Nest** (`apps/api`); the Next route is a thin BFF proxy only.

## Architecture

```txt
Browser → POST /api/admin/problems/generate (apps/app BFF)
       → POST /problems/generate (apps/api Nest)
       → OpenAI chat/completions
       → validate CreateProblemDto → { problem }
       → BFF normalizes errors → client fills form
```

- **`OPENAI_API_KEY` lives in `apps/api/.env` only** (same as problem tutor chat).
- The Next app never calls OpenAI directly for this feature.
- Problem **create/update** and **generate** both follow the same BFF → Nest pattern.

## Goal

Add an admin-only AI helper to the problem creation screen that lets the user describe a LeetCode-style problem in plain English, generate structured form values with AI, review/edit the populated form, and only save the problem after manually submitting the existing form.

This feature must **not** auto-create a problem in the database. AI only drafts form data.

## User story

As an admin, I want to type a short prompt like:

> Medium: longest consecutive sequence in an unsorted integer array, O(n). Use hash set solution.

Then click **Generate & fill form**, have the problem authoring form populated automatically, review and edit the generated fields, and finally submit the form myself.

## Existing context (shipped)

The admin Add Problem flow lives at `apps/app/features/admin/components/admin-add-problem-page.tsx` and renders `NewProblemForm`.

The form (`new-problem-form.tsx`) uses local `useState` for values — **not** React Hook Form. When `showDevFill` is true (create mode), the top of the form shows:

- **Development only** — `DevAdminProblemFill` dropdown (LC-style bundled samples under `features/admin/problems/*.ts`)
- **OpenAI helper** — `GenerateProblemFromPrompt` textarea + **Generate & fill form** button

Both controls call the same callback:

```ts
const handleDevFill = useCallback((sample: CreateProblemBody) => {
  setValues(sample);
  setMessage(null);
  setStatus("idle");
}, []);
```

Generation does not submit the form; only the existing **Create problem** button persists to the API.

## Non-goals

Do not build a chatbot in this feature.
Do not auto-submit generated problems.
Do not replace the existing problem creation form.
Do not add vector search or RAG.
Do not build a general OpenAI playground.
Do not expose this UI to non-admin users.
Do not store prompt history in this feature.
Do not require streaming responses for the first version.

## UX requirements

### Main flow

1. Admin opens the Add Problem page.
2. Admin enters a prompt in the AI generation textarea.
3. Admin clicks **Generate & fill form**.
4. Button enters loading state and the textarea remains visible.
5. Client calls `POST /api/admin/problems/generate` with the prompt.
6. Server calls OpenAI and returns validated structured problem form values.
7. Client applies the returned values via `setValues(normalizeCreateProblemBody(...))`.
8. Admin reviews and edits the generated fields.
9. Admin manually submits the form using the existing create-problem submit flow.

### Review-first behavior

The generated values populate the form but do not create anything in the database.

The final submit button remains the only action that persists the problem.

### Empty prompt state

If the prompt is empty or only whitespace:

- Disable the generate button (**shipped**), and optionally
- Show a validation message: `Describe the problem you want to generate first.` (**not shipped** — button disable only today)

### Loading state

While generating:

- Disable the generate button (**shipped**).
- Show button text like `Generating…` (**shipped**).
- Prevent duplicate requests via `busy` flag (**shipped**).
- Do not disable the full form unless necessary (**shipped**).

### Success state

After the form is filled:

- Show a small confirmation message such as `Draft generated. Review before submitting.` (**not shipped**)
- Keep the generated data editable (**shipped**).

### Error state

If generation fails:

- Keep the existing form values unchanged (**shipped** — failed generate never calls `onFilled`).
- Show a clear error message near the generate button (**shipped**).
- Example copy: `Could not generate problem draft. Try a more specific prompt.` (wording may vary; server errors pass through from API)

### Overwrite behavior

If the form already contains unsaved values and AI generation would overwrite them, show a confirmation before applying the generated draft.

Minimum acceptable version:

- If form is dirty, show `This will replace current form values. Continue?`
- User can cancel and keep current values.

**Not shipped.** `GenerateProblemFromPrompt` does not receive dirty-state props; `NewProblemForm` has no dirty tracking for this path.

## Data to generate

The AI response must map to `CreateProblemBody` in `features/admin/lib/create-problem-schema.ts`. Use that Zod schema as the source of truth.

Expected generated fields:

- `title`
- `slug`
- `difficulty`
- `description`
- `constraints`
- `examples`
- `testCases`
- `starterCode`
- `solutions` (array of `{ language, code, explanation?, timeComplexity?, spaceComplexity? }`)
- `hints`
- `tags`
- `editorial` (optional)
- `patternSlug`
- `loopStructure`
- `skillFocus`
- `tutorLevel`
- `visualizationNotes`
- `isPublished` — default `false`

Do not invent database fields outside this schema.

## AI output requirements

The model must return structured JSON only.

Generated content should be:

- Beginner-friendly
- Deterministic enough for form review
- Valid for `createProblemBodySchema`
- Safe to insert into form fields
- Free of markdown code fences around JSON (server strips fences if present)
- Not submitted directly to the database

The generated problem should include at least:

- Clear problem statement
- Constraints
- 2–3 examples
- Several test cases
- Starter code
- At least one reference solution in `solutions` (with explanation and complexity)
- At least 2 progressive hints in `hints`

## Server routes (shipped)

### Nest API (OpenAI + validation)

```txt
apps/api/src/problems/
  problems.controller.ts              # POST /problems/generate
  problem-generate.service.ts         # OpenAI call + CreateProblemDto validation
  problem-generate.constants.ts       # system prompt, model, max prompt length
  openai-completion.util.ts           # parse model JSON, read assistant content
  dto/generate-problem-from-prompt.dto.ts
```

### Next BFF (auth + proxy)

```txt
apps/app/app/api/admin/problems/generate/route.ts
```

The BFF:

1. Requires a signed-in session via `getApiAuth()`.
2. Forwards `{ prompt }` to `{NEON_JWT_API_URL}/problems/generate` with `catalogUpstreamHeaders()` (Bearer + optional internal secret).
3. Normalizes Nest error bodies to `{ error, issues?, detail? }` for the admin client.

### Request body

```ts
type GenerateProblemRequest = {
  prompt: string;
};
```

Validated on Nest with `GenerateProblemFromPromptDto` (trimmed, 1–2000 chars).

### Response body

```ts
type GenerateProblemResponse = {
  problem: CreateProblemBody;
};
```

Client-side Zod validation still runs in `requestGeneratedProblem` before applying values to the form.

### Error status codes (shipped)

| Status | Where | When |
| ------ | ----- | ---- |
| `400` | Nest / BFF | Invalid JSON body or invalid `prompt` |
| `401` | BFF or Nest | No session / unauthorized |
| `422` | Nest | Model JSON failed `CreateProblemDto` validation |
| `502` | Nest | OpenAI HTTP error, empty message, or unparseable model JSON |
| `503` | Nest | `OPENAI_API_KEY` not set on **apps/api** |

## Server-side requirements

**Nest (`ProblemGenerateService`):**

1. Protected by `ProblemsAccessGuard` (session or internal secret) (**shipped**).
2. Reads `OPENAI_API_KEY` from `process.env` on the API (**shipped**).
3. Validates request with `GenerateProblemFromPromptDto` (**shipped**).
4. Calls OpenAI (`gpt-4o-mini`, `response_format: json_object`) (**shipped**).
5. Validates model output with `CreateProblemDto` + class-validator (**shipped**).
6. Returns `{ problem }` (**shipped**).

**Next BFF:**

1. Requires authenticated session (**shipped**).
2. Proxies to Nest; does not read `OPENAI_API_KEY` (**shipped**).

Do not expose `OPENAI_API_KEY` to the browser.

## Client file map (actual)

Colocated under the existing admin feature — no separate `problem-form/` subfolder today.

```txt
apps/app/features/admin/
  components/
    new-problem-form.tsx              # form owner; handleDevFill, showDevFill shell
    generate-problem-from-prompt.tsx  # AI prompt UI (spec alias: AiProblemDraftPanel)
    dev-admin-problem-fill.tsx        # dev-only sample dropdown
  lib/
    create-problem-schema.ts          # CreateProblemBody + Zod
    problem-form-values.ts            # normalizeCreateProblemBody (spec alias: applyGeneratedProblemValues)
    request-generated-problem.ts      # fetch client (spec alias: generateProblemClient)
  problems/
    *.ts                              # bundled dev samples; dev-sample-*.ts for deterministic copies
```

### `GenerateProblemFromPrompt` (≈ spec `AiProblemDraftPanel`)

Renders:

- AI prompt textarea
- Generate button
- Loading and error messages

Props today:

```ts
type GenerateProblemFromPromptProps = {
  onFilled: (values: CreateProblemBody) => void;
  hasUnsavedFormValues?: boolean;
};
```

Dev autofill stays in `DevAdminProblemFill` as a sibling in `NewProblemForm`, not inside the generate panel.

### `requestGeneratedProblem` (≈ spec `generateProblemClient`)

- `fetch('/api/admin/problems/generate')` with credentials
- Parses JSON; validates `problem` with `createProblemBodySchema` on the client
- Returns `{ ok: true, body }` or `{ ok: false, error }`

### `normalizeCreateProblemBody` (≈ spec `applyGeneratedProblemValues`)

- Maps API/problem records into form-ready `CreateProblemBody`
- Applies defaults (e.g. empty editorial, boolean fields)

### Optional future refactor

Extract prompt/loading/error/generate logic into `hooks/use-ai-problem-draft.ts` if the panel grows. Not required for feature completion.

## Form integration requirements

The existing form owns final values and submission via `useState` in `NewProblemForm`.

When AI generation succeeds:

- Call `setValues(normalizeCreateProblemBody(generated))` through `handleDevFill` (**shipped**).
- Preserve user ability to edit all fields (**shipped**).
- Keep submit-time validation active (**shipped**).
- Do not submit automatically (**shipped**).

## Validation requirements

### Client

- Prompt must be non-empty (**shipped** — disabled button).
- Prompt max length (~2,000 characters) (**not shipped**).
- Render API errors near the generate button (**shipped**).

### Server

- Validate request prompt is non-empty (**shipped**).
- Validate AI response with `createProblemBodySchema` (**shipped**).
- Return `422` with safe message on schema failure (**shipped**).

## Security requirements

- Only authenticated users can call the generate endpoint (**shipped** — session check; admin route UI is already gated).
- `OPENAI_API_KEY` is server-side only (**shipped**).
- Do not log full prompts or generated solutions in production unless behind a debug flag.
- Rate-limit or throttle if exposed beyond local/admin usage.
- Generated content must pass form validation before saving (**shipped** on submit path).

## Environment variable

Required in **`apps/api/.env`** (same key as problem tutor chat):

```txt
OPENAI_API_KEY=...
```

The admin UI shows helper text in the dev fill shell (**shipped**):

```txt
OpenAI — set OPENAI_API_KEY in apps/api env
```

Do **not** set `OPENAI_API_KEY` in `apps/app` for this feature.

## Implementation stages (revised)

Stages reflect **actual** progress. Original Stage 1 “client-only fake data” was skipped in favor of shipping the API early.

### Stage 1 — Client UX shell — **mostly shipped**

| Task | Status |
| ---- | ------ |
| Extract AI prompt area from inline form | Done — `GenerateProblemFromPrompt` |
| Prompt, loading, error states | Done |
| Success state message | **Remaining** |
| Empty prompt validation | Done (button disable) |
| Fill form on generate (review-first) | Done |
| Dirty overwrite confirmation | **Remaining** |
| Fake data without API (original plan) | Skipped — went to live API instead |

### Stage 2 — API route contract — **shipped**

| Task | Status |
| ---- | ------ |
| Nest `POST /problems/generate` | Done |
| Next BFF proxy `POST /api/admin/problems/generate` | Done |
| Auth/session check (BFF + Nest guard) | Done |
| Empty/invalid prompt rejection | Done |
| Typed `{ problem: CreateProblemBody }` response | Done |
| Client wired via `requestGeneratedProblem` | Done |
| Non-200 handling on client | Done |

### Stage 3 — OpenAI generation — **shipped (Nest)**

| Task | Status |
| ---- | ------ |
| OpenAI helper (`openai-completion.util.ts` on API) | Done |
| `OPENAI_API_KEY` from **apps/api** env | Done |
| Strict JSON-only prompt + `json_object` format | Done |
| Safe parse (fence strip) + `CreateProblemDto` validation | Done |
| `isPublished` defaults to `false` in model prompt | Done |

### Stage 4 — Polish errors and guardrails — **in progress**

| Task | Status |
| ---- | ------ |
| Client error messages | Done (basic) |
| Server status codes (`400`, `401`, `422`, `502`, `503`) | Done |
| Prompt character count / max length | **Remaining** |
| Dirty-form overwrite confirmation | **Remaining** |
| Success message: “Draft generated. Review before submitting.” | **Remaining** |

### Stage 5 — Tests and cleanup — **not started**

| Task | Status |
| ---- | ------ |
| Unit test prompt/request validation | Remaining |
| Unit test `normalizeCreateProblemBody` / defaults | Remaining |
| Unit test `requestGeneratedProblem` error handling | Remaining |
| `pnpm typecheck` | Should pass today |
| Manual full-flow test | Ongoing |

## Manual test plan

| # | Scenario | Status |
| - | -------- | ------ |
| 1 | Empty prompt disables generation | Pass |
| 2 | Valid prompt generates and fills the form (requires `OPENAI_API_KEY` on **apps/api**) | Pass |
| 3 | User edits generated fields before submit | Pass |
| 4 | Generated problem does not save until final submit | Pass |
| 5 | Dirty form shows overwrite confirmation | **Fail** — not implemented |
| 6 | API failure shows error; form values unchanged | Pass |
| 7 | Missing `OPENAI_API_KEY` shows safe error (`503` from Nest) | Pass |
| 8 | Unauthenticated user cannot call endpoint (`401`) | Pass |
| 9 | Generated slug is valid and unique enough for review | Manual |
| 10 | Dev sample autofill still works | Pass |

## Done definition

This feature is done when:

- Admin can describe a problem in plain English. (**done**)
- AI fills the existing create problem form. (**done**)
- Admin can review and edit all fields. (**done**)
- Nothing is saved until the admin submits the form. (**done**)
- Server validates both request and AI response. (**done**)
- API key is never exposed to the client. (**done**)
- Success message and dirty overwrite confirmation work. (**remaining**)
- UI follows the project design system conventions. (**done**)
- `pnpm typecheck` passes. (**expected**)
- Targeted unit tests for client/server helpers. (**remaining**)
