# Interview Generator — smoke test

Run after deploy or local changes to spec **03** (`POST /interview/sessions/generate`, `POST /interview/sessions`).

**Automated (no DB):** from `apps/api`:

```sh
pnpm test -- interview-session-generator.smoke.spec.ts
```

**Prerequisites**

- `pnpm dev` (or API on `:3000` / configured URL + interview on `:3012`)
- Clerk sign-in on interview app
- Saved profile at `/profile`
- Saved job analysis at `/job-analysis`
- Migration `0007` applied (`interview_sessions`, `interview_questions`)

---

## Manual E2E (primary sign-off)

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open `/interviews/start` | Profile + job analysis summaries visible |
| 2 | Click **Generate interview** | Preview within ~30s (stub or OpenAI) |
| 3 | Preview | Title, **≥5** questions, categories listed |
| 4 | Click **Start practice** | Redirect to `/interviews/{uuid}/play` |
| 5 | Play Q1 | TTS optional; record or type answer |
| 6 | Submit → Next | Placeholder feedback; advance |
| 7 | Complete all questions | `/interviews/{uuid}/complete` |

**Stub path:** unset `OPENAI_API_KEY` on `apps/api` — title may include `(dev stub…)`.

**Regenerate:** From preview, **Regenerate** replaces blueprint without persisting until **Start practice**.

---

## API curl (optional, needs Clerk JWT)

```sh
# Replace TOKEN and API_BASE
export API_BASE=http://localhost:3000
export TOKEN="Bearer <clerk-jwt>"

curl -sS -X POST "$API_BASE/interview/sessions/generate" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}' | jq '.questionCount, .interviewTitle'

# Paste profileId, jobAnalysisId, and blueprint from response into create body
```

---

## Dev seed (regression)

Footer link **quick seed (3 questions)** still creates a session and opens play — use only for fast player checks, not generator sign-off.
