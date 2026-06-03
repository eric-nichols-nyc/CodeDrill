# Question Player System

**Goal:** Guided, one-question-at-a-time interview practice — load an existing session, capture answers, persist transcripts, advance with placeholder feedback until evaluation ships.

**Depends on:** Authenticated user; persisted `interview_sessions` + `interview_questions` (from Interview Generator or dev seed).

**Blocks:** Answer Evaluation (needs saved `transcript` per question).

**Out of scope (this system):** Question generation, scoring answers, final reports, real-time chat, adaptive follow-ups.

**Implementation plan:** [04-question-player-implementation.md](../implementation/04-question-player-implementation.md)

---

## User stories

### US-1 — Start a saved interview session

**As a** signed-in candidate  
**I want to** open my interview at `/interviews/[interviewId]/play`  
**So that** I can practice questions that were already generated for me.

**Acceptance criteria**

- Session loads with title, progress (N of M), and questions in `display_order`.
- Session moves from `ready` to `in_progress` when play starts.
- Only the session owner can access the route.

---

### US-2 — Focus on one question at a time

**As a** candidate  
**I want to** see a single question with category and difficulty  
**So that** I can concentrate on one topic without distraction.

**Acceptance criteria**

- UI shows question number, total count, category, difficulty, and question text.
- Progress indicator reflects position in the interview.

---

### US-3 — See what a strong answer should cover (`expectedSignals`)

**As a** candidate  
**I want to** see the **expected signals** for the current question  
**So that** I know what themes to address while practicing (coaching rubric, not a hidden test).

**Acceptance criteria**

- `expectedSignals` render on the question card (e.g. bullet list).
- Copy explains they are practice targets; automated scoring comes after submit (Evaluation System).
- Signals are read-only (generated at interview creation; not editable in the player).

See [What are expected signals?](#what-are-expected-signals) below.

---

### US-4 — Hear the question read aloud (TTS)

**As a** candidate  
**I want to** press a button and hear the **current question read aloud**  
**So that** practice feels like a real interviewer asking the question.

**Acceptance criteria**

- Button on the question card (e.g. “Listen to question” / “Play question”).
- Uses **text-to-speech (TTS)** on the question text — browser `speechSynthesis` or equivalent.
- User can stop playback while it is speaking.
- TTS is optional; question text remains visible on screen.
- Does not require microphone permission.

**Note:** TTS = **text → speech** (output). This is not transcription.

---

### US-5 — Record answer with microphone; live transcription into textarea (STT)

**As a** candidate  
**I want to** press **Record**, speak my answer, and see words appear in the answer textarea as I talk  
**So that** I can answer out loud and still review or edit text before submitting.

**Acceptance criteria**

- **No mock/fake transcription** — words come from real **speech-to-text (STT)**.
- On first Record (or on entering answer mode), request **microphone permission** (`getUserMedia` and/or STT APIs as required by the browser).
- If permission is denied: clear message; user can still type in the textarea.
- While recording: STT **streams** into the shared answer `<textarea>` (interim + final phrases).
- Stop Record ends capture and STT session; transcript remains editable in the textarea.
- **Re-record:** starting Record again **clears and replaces** the textarea for that attempt (does not append to the previous take).
- Submit uses the textarea contents; `answerMode: "voice"` when the answer was captured primarily via Record (otherwise `"text"` if typed only).
- User may type without recording at any time (keyboard + mic are complementary).

**Note:** STT = **speech → text** (input). Do not confuse with TTS (US-4).

---

### US-6 — Submit answer and persist

**As a** candidate  
**I want to** submit the textarea contents  
**So that** my response is saved before I move on.

**Acceptance criteria**

- Submit disabled when transcript is empty (trimmed).
- Submit persists `CandidateAnswer` (`transcript`, `answerMode`, `submittedAt`, optional `durationSeconds`).
- **Next** is disabled until the current question is submitted.
- Submit on an already-answered question **overwrites** the saved transcript (re-answer allowed).

---

### US-7 — Review placeholder feedback, then continue

**As a** candidate  
**I want to** see a short confirmation after I submit  
**So that** I know my answer was saved before going to the next question.

**Acceptance criteria**

- After submit, show a **feedback placeholder** (not AI evaluation): e.g. “Answer saved — detailed feedback coming soon.”
- **Next Question** advances only from this step (or equivalent control on the placeholder card).
- No scores, strengths, or weaknesses until Answer Evaluation is implemented.

---

### US-8 — Navigate and complete the interview

**As a** candidate  
**I want to** move to previous questions and finish after the last submit  
**So that** I can review earlier answers and complete the run.

**Acceptance criteria**

- **Previous** works when not on the first question.
- **Next** only after current question is submitted (no skipping unanswered questions).
- Revisiting an answered question shows the saved transcript; user may edit and re-submit.
- After the last question is submitted, session becomes `completed` and user is routed to a completion screen (final report is a separate system).

---

## Voice-first flow (per question) — implement before full player

This flow must be **designed, built, and validated** before the rest of the player slice (submit API, placeholder feedback, session navigation) is considered complete.

### Terminology

| Term | Direction | Role in player |
|------|-----------|----------------|
| **TTS** (text-to-speech) | Text → audio | Read question aloud (US-4) |
| **STT** (speech-to-text) | Audio → text | Fill answer textarea while user speaks (US-5) |

### Step-by-step (Q1, repeats for Q2…)

```txt
1. User starts interview → session loads → Question 1 shown
   (title, progress, category, difficulty, question text, expectedSignals)

2. User taps [ Listen to question ]  (optional)
   → TTS speaks question text
   → User may [ Stop ] playback

3. User taps [ Record ]
   → Browser prompts for microphone (first time)
   → STT starts; partial/final phrases stream into answer textarea

4. User taps [ Stop recording ]
   → STT stops; textarea holds full draft (editable)

5. User may edit textarea, or tap [ Record ] again to **replace** the answer (previous text cleared)
   or type without using Record

6. (Later in slice) User taps [ Submit ] → placeholder feedback → Next question
```

### Wireframe (one screen)

```txt
┌─────────────────────────────────────────────────────────┐
│ Senior Frontend Engineer Interview    Question 1 / 10   │
│ [========············] 10%                            │
├─────────────────────────────────────────────────────────┤
│ Category: Micro Frontends    Difficulty: Senior         │
│                                                         │
│ How would you share authentication across…?             │
│ [ Listen to question ]                                  │
│                                                         │
│ What to cover:                                          │
│ • shared authentication strategy                        │
│ • ownership boundaries                                  │
│ • …                                                     │
├─────────────────────────────────────────────────────────┤
│ Your answer                                             │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ (textarea — populated live by STT while recording)  │ │
│ └─────────────────────────────────────────────────────┘ │
│ [ Record ]  [ Stop ]     (timer optional)               │
│                                                         │
│ [ Submit answer ]   [ Previous ]  [ Next ] (gated)      │
└─────────────────────────────────────────────────────────┘
```

### Out of scope for this voice flow

- Sending audio files to the server (MVP stores **transcript** text only).
- OpenAI / server Whisper (optional upgrade — see implementation plan).
- AI evaluation or scores after submit.

---

## What are expected signals?

**`expectedSignals`** (field on each `InterviewQuestion`) are the **evidence rubric** for that question — a checklist of concepts a **strong** answer would typically include. They are created by the **Interview Generator**, not the Question Player.

| Aspect | Detail |
|--------|--------|
| **Purpose** | Tell the candidate what to aim for while practicing; give Answer Evaluation a fixed checklist to score against later. |
| **Not** | The exact words the candidate must say; a single “correct” answer; hidden trick questions. |
| **Example** | For “How would you share authentication across micro frontends?” signals might include: `shared authentication strategy`, `ownership boundaries`, `token management`, `team independence`. |
| **Who uses them** | **Player (this spec):** display to the candidate. **Evaluation (spec 05):** compare `transcript` to which signals were demonstrated. |
| **Storage** | `interview_questions.expected_signals` (text array), snapshot at generation time. |

Showing signals during practice is an intentional coaching choice (locked product decision). Evaluation still runs only after submit, in a separate system.

---

## Locked product decisions

| Topic | Decision |
|-------|----------|
| Build order | **Voice flow first** (TTS + mic + STT → textarea), then submit/navigation/persistence |
| TTS | **User-triggered** button reads question (`speechSynthesis` acceptable for MVP) |
| STT | **Live transcription into textarea** while recording — no mock typing animation |
| Re-record | **Replace** — new Record clears textarea and starts a fresh take |
| Microphone | **Real browser permission** — no fake transcripts |
| Post-submit UX | **(A)** Feedback **placeholder** + **Next Question** (after voice flow gate) |
| Next without submit | **No** |
| Re-answer | **Yes** — overwrite saved transcript |
| Dev data | **Option A** — dev seed session |
| Route | **`/interviews/[interviewId]/play`** |
| Show `expectedSignals` | **Yes** |
| Implementation | **Voice flow next** — see [implementation plan](../implementation/04-question-player-implementation.md) |

---

## Purpose

The Question Player presents one interview question at a time, captures the candidate’s spoken or typed answer, submits the answer for evaluation, and moves the user through the interview in a focused slideshow-style experience.

The Question Player does not generate questions.

The Question Player does not evaluate answers.

The Question Player controls the interview experience.

---

# Inputs

## Interview Blueprint

Generated by the Interview Generator.

Includes:

* Interview title
* Question count
* Categories
* Estimated duration
* Ordered questions

---

## Questions

Each question includes:

* Question text
* Category
* Difficulty
* Expected answer signals
* Follow-up opportunities

Example:

```json
{
  "id": "q_001",
  "order": 1,
  "category": "Micro Frontends",
  "difficulty": "Senior",
  "question": "How would you share authentication across independently deployed micro frontends?",
  "expectedSignals": [
    "shared authentication strategy",
    "ownership boundaries",
    "token management",
    "team independence"
  ],
  "followUpOpportunities": [
    "Ask about token refresh strategy",
    "Ask about deployment ownership"
  ]
}
```

---

# Outputs

## Candidate Answer

The Question Player produces an answer object that can be sent to the Evaluation System.

Example:

```json
{
  "questionId": "q_001",
  "interviewId": "interview_001",
  "answerMode": "voice",
  "transcript": "I would start by keeping authentication centralized in the shell application...",
  "durationSeconds": 92,
  "submittedAt": "2026-06-02T12:00:00Z"
}
```

---

# Core Responsibilities

## 1. Display One Question At A Time

The user should focus on a single question.

The UI should show:

* Current question
* Question number
* Total questions
* Category
* Difficulty
* Progress indicator
* **Expected signals** (coaching rubric — see [What are expected signals?](#what-are-expected-signals))

Example:

```txt
Question 3 of 10

Category: Micro Frontends
Difficulty: Senior

How would you share authentication across independently deployed micro frontends?
```

---

## 2. Capture Answer

The user should be able to answer by:

* Voice
* Typed text

Voice is preferred because the product is designed to build interview confidence.

Voice capture must use **real microphone permission** and **real STT** into the answer textarea — no mock or fake transcripts. **TTS** for reading the question is a separate control (US-4). See [Voice-first flow](#voice-first-flow-per-question--implement-before-full-player).

---

## 3. Manage Interview State

The Question Player should manage the current state of the question.

Possible states:

```txt
idle
recording
transcribing
ready_to_submit
submitting
feedback_ready
completed
```

---

## 4. Submit Answer For Evaluation

When the user submits an answer, the Question Player sends:

* Question
* Expected signals
* Transcript
* Interview context

to the Evaluation System.

The Question Player should not score the answer itself.

---

## 5. Display Feedback

After evaluation, the Question Player displays feedback for the current question.

Feedback may include:

* Score
* Strengths
* Weaknesses
* Missing concepts
* Suggested answer
* Follow-up topics

---

## 6. Move To Next Question

After reviewing feedback, the user can continue.

Actions:

* Next Question
* Retry Answer
* Skip Question
* End Interview

---

# MVP Screen Flow

## Step 1: Question Card

Display:

* Question number
* Category
* Difficulty
* Question text
* Start Recording button
* Type Answer option

---

## Step 2: Answer Capture

Display:

* Recording state
* Timer
* Stop Recording button
* Transcript area

---

## Step 3: Submit Answer

Display:

* Editable transcript
* Submit Answer button

---

## Step 4: Feedback Card

Display:

* Score
* Strengths
* Weaknesses
* Suggested answer
* Next Question button

---

## Step 5: Completion

When all questions are answered, route the user to the Final Report.

---

# Example UI Structure

```txt
------------------------------------------------

Senior Frontend Engineer Interview

Question 4 / 10
Category: Architecture
Difficulty: Senior

How would you design shared state across multiple micro frontends?

[ Start Recording ]

or

[ Type Answer ]

------------------------------------------------
```

After recording:

```txt
------------------------------------------------

Transcript

"I would start by identifying what state should be global..."

[ Submit Answer ]

------------------------------------------------
```

After evaluation:

```txt
------------------------------------------------

Feedback

Score: 7 / 10

Strengths:
- Clear ownership model
- Good explanation of shared contracts

Missing:
- Did not mention deployment boundaries
- Did not discuss dependency versioning

Suggested Improvement:
Mention how each team can deploy independently while consuming shared contracts safely.

[ Next Question ]

------------------------------------------------
```

---

# Component Ideas

Possible components:

* `InterviewPlayer`
* `QuestionCard`
* `ProgressIndicator`
* `AnswerRecorder`
* `TranscriptEditor`
* `SubmitAnswerButton`
* `FeedbackCard`
* `InterviewNavigation`

---

# Data Shape

```ts
type QuestionPlayerState =
  | "idle"
  | "recording"
  | "transcribing"
  | "ready_to_submit"
  | "submitting"
  | "feedback_ready"
  | "completed"

type CandidateAnswer = {
  questionId: string
  interviewId: string
  answerMode: "voice" | "text"
  transcript: string
  durationSeconds?: number
  submittedAt: string
}
```

---

# MVP Scope

The MVP should:

1. Display one question at a time
2. Show interview progress
3. Allow voice or typed answer input
4. Show transcript before submission
5. Submit answer to Evaluation System
6. Display feedback
7. Move to the next question
8. Route to Final Report when complete

The MVP should not:

* Generate questions
* Evaluate answers
* Generate final reports
* Support multiple interviewers
* Support real-time interruption
* Support fully conversational voice

Those responsibilities belong to other systems or future versions.

---

# Guiding Principle

The Question Player is not a chatbot.

The Question Player is a guided interview experience.

Its purpose is to help the candidate focus on one question at a time, answer out loud, receive feedback, and build confidence through structured practice.
