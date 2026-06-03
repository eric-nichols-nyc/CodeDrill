# Data Contracts

Source of truth for data that flows between systems in the AI Interview Coach pipeline. Use this document when designing database schemas, API payloads, Zod validators, and OpenAI structured outputs.

This document defines **what data moves between systems**, not how it is stored or transported.

---

## Pipeline overview

```txt
Resume                          Job Description
   ↓                                   ↓
Profile System                  Job Analysis System
   ↓                                   ↓
CandidateProfile                JobAnalysis
         ↘                       ↙
          Interview Generator
                   ↓
          InterviewBlueprint  (contains InterviewQuestion[])
                   ↓
          Question Player → CandidateAnswer
                   ↓
          Answer Evaluation → EvaluationResult
                   ↓
          InterviewSession (runtime aggregate)
                   ↓
          Final Report System → FinalReport
```

---

## Conventions

### Scoring

All numeric scores use a **0–100** integer scale.

- Per-question scores (`EvaluationResult.score`) are 0–100.
- Aggregate scores (`FinalReport.overallScore`) use the same scale, typically derived from per-question scores.

### Naming

Field names follow the **feature specs** (`potentialGapAreas`, `strengthAreas`, `missingSignals`, `interviewTitle`, etc.). Prototype mock names are not canonical.

### Identity fields

Contracts that cross system boundaries or require correlation include stable identifiers:

| Field | Used on |
|-------|---------|
| `id` | Persisted entities (`CandidateProfile`, `JobAnalysis`, `InterviewSession`, `FinalReport`) |
| `interviewId` | Runtime artifacts tied to one interview run |
| `questionId` | Questions, answers, and evaluations |

Pure AI extraction outputs may omit `id` until persisted. Once saved or entering the interview runtime, identifiers are required.

Timestamps use ISO 8601 strings (`createdAt`, `updatedAt`, `submittedAt`).

### Nested types

Sub-shapes are defined as **named exported interfaces** and composed into parent contracts.

### MVP vs future

Fields or contracts marked **future** are documented for alignment but are out of scope for MVP implementation.

---

## Shared types

```ts
/** ISO 8601 datetime string, e.g. "2026-06-02T12:00:00.000Z" */
export type ISODateTime = string

/** Integer score from 0 (no evidence) to 100 (exceptional) */
export type Score = number

export type ConfidenceLevel = "Low" | "Medium" | "High"

export type AnswerMode = "voice" | "text"

export type InterviewStatus =
  | "draft"
  | "ready"
  | "in_progress"
  | "completed"
  | "abandoned"
```

---

## 1. CandidateProfile

### Purpose

Structured representation of a candidate derived from their resume. Captures skills, project history, verifiable claims, and inferred strength/gap areas so downstream systems can generate targeted questions and evaluate answers against resume context.

### Created by

**Profile System** (AI extraction from resume text, optionally revised by the user).

### Consumed by

| System | Usage |
|--------|-------|
| Interview Generator | Tailors questions to resume claims, projects, and gap areas |
| Answer Evaluation | *(future)* Optional role-fit context beyond strict MVP inputs |
| Final Report | *(future)* Cross-reference weakness patterns with profile gap areas |

### TypeScript

```ts
export interface ProjectExperience {
  name: string
  role: string
  /** Concrete, interview-verifiable statements from the resume */
  claims: string[]
}

export interface ResumeClaim {
  claim: string
  /** How an interviewer might probe this claim */
  questionAngle: string
}

export interface CandidateProfile {
  id?: string
  summary: string
  coreSkills: string[]
  projects: ProjectExperience[]
  claimsToVerify: ResumeClaim[]
  strengthAreas: string[]
  potentialGapAreas: string[]
  createdAt?: ISODateTime
  updatedAt?: ISODateTime
}
```

### Important fields

| Field | Notes |
|-------|-------|
| `summary` | One-paragraph candidate overview used as compact context in prompts |
| `coreSkills` | Normalized skill list extracted from the resume |
| `projects` | Named experiences with role and verifiable claims — primary source for resume-deep-dive questions |
| `claimsToVerify` | High-value resume statements paired with suggested probe angles |
| `strengthAreas` | Topics where the candidate is likely strong |
| `potentialGapAreas` | Topics that may be weak or underrepresented — used to stress-test the candidate |
| `id` | Present once the profile is saved; omitted on first AI extraction |

### Example

```json
{
  "id": "profile_abc123",
  "summary": "Eric is a senior frontend developer with 11+ years of experience building React, TypeScript, Next.js, design system, and AI-powered applications.",
  "coreSkills": [
    "React",
    "TypeScript",
    "Next.js",
    "Storybook",
    "Design Systems",
    "Micro Frontends",
    "Accessibility",
    "Playwright",
    "AI Integrations"
  ],
  "projects": [
    {
      "name": "IBM Back-Office Platform",
      "role": "Lead Frontend Architect",
      "claims": [
        "Supported 5,000+ content marketers",
        "Built scalable frontend architecture",
        "Worked with permissions and enterprise workflows"
      ]
    },
    {
      "name": "VoteMate",
      "role": "Senior Frontend Developer",
      "claims": [
        "Built chatbot interface",
        "Integrated AI-driven candidate matching",
        "Implemented Playwright tests"
      ]
    }
  ],
  "claimsToVerify": [
    {
      "claim": "Implemented Playwright tests for chatbot interactions",
      "questionAngle": "Ask for a concrete testing example"
    },
    {
      "claim": "Led frontend architecture for IBM platform",
      "questionAngle": "Ask about scalability, permissions, and ownership boundaries"
    }
  ],
  "strengthAreas": [
    "React component architecture",
    "Storybook and design systems",
    "Accessibility",
    "Frontend UI development",
    "AI product interfaces"
  ],
  "potentialGapAreas": [
    "frontend observability",
    "state machines",
    "production monitoring",
    "deep micro frontend deployment strategy"
  ],
  "createdAt": "2026-06-01T10:00:00.000Z",
  "updatedAt": "2026-06-01T10:00:00.000Z"
}
```

---

## 2. JobAnalysis

### Purpose

Structured interview intelligence derived from a job description. Represents what the company needs, what the candidate must prove, and how an interviewer is likely to probe — without generating actual interview questions.

### Created by

**Job Analysis System** (AI extraction from job description and optional metadata).

### Consumed by

| System | Usage |
|--------|-------|
| Interview Generator | Primary input for question targeting, difficulty, and category selection |
| Final Report | Role readiness framing and alignment with `mustProve` expectations |

### TypeScript

```ts
export interface SeniorityLevel {
  level: string
  confidence: ConfidenceLevel
}

export interface HiddenExpectation {
  expectation: string
  reason: string
}

export interface SuggestedQuestionAngle {
  category: string
  angle: string
}

export interface JobAnalysis {
  id?: string
  companyName: string
  roleTitle: string
  roleSummary: string
  requiredSkills: string[]
  niceToHaveSkills: string[]
  seniorityLevel: SeniorityLevel
  likelyInterviewCategories: string[]
  mustProve: string[]
  hiddenExpectations: HiddenExpectation[]
  interviewSignals: string[]
  suggestedQuestionAngles: SuggestedQuestionAngle[]
  createdAt?: ISODateTime
  updatedAt?: ISODateTime
}
```

### Important fields

| Field | Notes |
|-------|-------|
| `companyName`, `roleTitle` | Source context preserved for display and report framing |
| `roleSummary` | Concise description of primary responsibilities |
| `requiredSkills` | Explicitly stated must-haves from the posting |
| `niceToHaveSkills` | Preferred but non-required skills |
| `seniorityLevel` | Inferred level with confidence — drives question difficulty |
| `likelyInterviewCategories` | Topic areas most likely to appear in a real interview |
| `mustProve` | Core competencies the hiring team needs validated — highest-priority generator input |
| `hiddenExpectations` | Implied requirements not stated explicitly in the JD |
| `interviewSignals` | Traits interviewers are likely evaluating (depth, ownership, communication, etc.) |
| `suggestedQuestionAngles` | Directional probes the generator can turn into concrete questions |

### Example

```json
{
  "id": "job_xyz789",
  "companyName": "Publicis Sapient",
  "roleTitle": "Senior Frontend Engineer",
  "roleSummary": "Senior Frontend Engineer focused on React, TypeScript, Micro Frontends, Design Systems, and enterprise-scale frontend architecture.",
  "requiredSkills": [
    "React",
    "TypeScript",
    "Micro Frontends",
    "Design Systems",
    "Accessibility",
    "Testing"
  ],
  "niceToHaveSkills": [
    "AWS",
    "GraphQL",
    "CI/CD",
    "Performance Monitoring"
  ],
  "seniorityLevel": {
    "level": "Senior",
    "confidence": "High"
  },
  "likelyInterviewCategories": [
    "React Architecture",
    "Micro Frontends",
    "Design Systems",
    "Frontend Performance",
    "Testing",
    "Leadership",
    "Cross-Team Collaboration"
  ],
  "mustProve": [
    "Can design scalable frontend architecture",
    "Can work independently",
    "Can mentor other developers",
    "Can make technical tradeoff decisions",
    "Can collaborate across teams",
    "Can own delivery of large features"
  ],
  "hiddenExpectations": [
    {
      "expectation": "Architecture ownership",
      "reason": "Role emphasizes scalable frontend systems and micro frontends"
    },
    {
      "expectation": "Cross-team communication",
      "reason": "Role requires collaboration across engineering, product, and design"
    }
  ],
  "interviewSignals": [
    "Depth of React knowledge",
    "System thinking",
    "Decision making",
    "Ownership",
    "Communication",
    "Problem solving"
  ],
  "suggestedQuestionAngles": [
    {
      "category": "Micro Frontends",
      "angle": "How would you share authentication across independently deployed applications?"
    },
    {
      "category": "Design Systems",
      "angle": "How would you manage versioning and adoption across multiple teams?"
    },
    {
      "category": "Leadership",
      "angle": "Tell me about a technical disagreement and how you resolved it."
    }
  ],
  "createdAt": "2026-06-01T10:05:00.000Z",
  "updatedAt": "2026-06-01T10:05:00.000Z"
}
```

---

## 3. InterviewBlueprint

### Purpose

The complete interview plan produced after combining candidate profile and job analysis. Defines interview metadata, category coverage, and the full ordered list of questions to be presented.

The blueprint is the **generation output**. It does not contain answers or evaluations.

### Created by

**Interview Generator**.

### Consumed by

| System | Usage |
|--------|-------|
| Question Player | Drives interview flow, progress, and question display |
| Interview Session | Stored as the plan snapshot for a run |
| Final Report | Provides categories, title, and question context for aggregation |

### TypeScript

```ts
export interface InterviewBlueprint {
  interviewId: string
  interviewTitle: string
  estimatedDurationMinutes: number
  questionCount: number
  categories: string[]
  /** Full ordered question payloads — not references */
  questions: InterviewQuestion[]
  generatedAt: ISODateTime
}
```

### Important fields

| Field | Notes |
|-------|-------|
| `interviewId` | Stable identifier for this interview run; shared by session, answers, and report |
| `interviewTitle` | Human-readable title, typically derived from role title |
| `estimatedDurationMinutes` | Expected completion time for UX display |
| `questionCount` | Denormalized count; must equal `questions.length` |
| `categories` | Unique or ordered category list covered by the interview |
| `questions` | Full `InterviewQuestion[]` in presentation order |

### Example

```json
{
  "interviewId": "interview_001",
  "interviewTitle": "Senior Frontend Engineer Interview",
  "estimatedDurationMinutes": 30,
  "questionCount": 3,
  "categories": [
    "Resume Deep Dive",
    "Micro Frontends",
    "Leadership"
  ],
  "questions": [
    {
      "id": "q_001",
      "order": 1,
      "category": "Resume Deep Dive",
      "difficulty": "Senior",
      "question": "You led frontend architecture for the IBM platform. How did you handle permissions and ownership boundaries at scale?",
      "expectedSignals": [
        "scalability approach",
        "permissions model",
        "team ownership boundaries",
        "enterprise workflow constraints"
      ],
      "followUpOpportunities": [
        "Ask how teams negotiated shared vs local state",
        "Ask about rollout and migration strategy"
      ]
    },
    {
      "id": "q_002",
      "order": 2,
      "category": "Micro Frontends",
      "difficulty": "Senior",
      "question": "How would you share authentication across independently deployed micro frontends?",
      "expectedSignals": [
        "shared authentication strategy",
        "ownership boundaries",
        "token management",
        "team independence",
        "deployment considerations"
      ],
      "followUpOpportunities": [
        "Ask about token refresh strategy",
        "Ask about security concerns"
      ]
    },
    {
      "id": "q_003",
      "order": 3,
      "category": "Leadership",
      "difficulty": "Senior",
      "question": "Tell me about a technical disagreement you resolved while mentoring other developers.",
      "expectedSignals": [
        "conflict resolution",
        "technical reasoning",
        "mentoring impact",
        "stakeholder communication"
      ],
      "followUpOpportunities": [
        "Ask what you would do differently",
        "Ask how you measured the outcome"
      ]
    }
  ],
  "generatedAt": "2026-06-02T11:00:00.000Z"
}
```

---

## 4. InterviewQuestion

### Purpose

A single interview question with the evidence rubric the evaluation system will use. Defined standalone because the same shape appears inside `InterviewBlueprint`, is displayed by the Question Player, and is partially passed to Answer Evaluation.

### Created by

**Interview Generator** (as part of `InterviewBlueprint.questions`).

### Consumed by

| System | Usage |
|--------|-------|
| Question Player | Display, progress, and submission context |
| Answer Evaluation | Question text and `expectedSignals` (strict MVP input) |
| Interview Session | Per-question runtime state |
| Final Report | Category and difficulty context for pattern analysis |

### TypeScript

```ts
export interface InterviewQuestion {
  id: string
  order: number
  category: string
  difficulty: string
  question: string
  /** Evidence a strong answer should contain — primary evaluation rubric */
  expectedSignals: string[]
  /** Optional probe directions — not evaluated in MVP; useful for future adaptive follow-ups */
  followUpOpportunities: string[]
}
```

### Important fields

| Field | Notes |
|-------|-------|
| `id` | Stable reference for answers and evaluations |
| `order` | 1-based presentation sequence |
| `category` | Topic bucket; used in progress UI and report pattern grouping |
| `difficulty` | Typically aligned with job seniority (e.g. `"Senior"`) |
| `question` | Full question text shown to the candidate |
| `expectedSignals` | Rubric items; evaluation checks which signals the answer demonstrated |
| `followUpOpportunities` | Generator hints for deeper probing; **future** adaptive interview use |

### Example

```json
{
  "id": "q_002",
  "order": 2,
  "category": "Micro Frontends",
  "difficulty": "Senior",
  "question": "How would you share authentication across independently deployed micro frontends?",
  "expectedSignals": [
    "shared authentication strategy",
    "ownership boundaries",
    "token management",
    "team independence",
    "deployment considerations"
  ],
  "followUpOpportunities": [
    "Ask about token refresh strategy",
    "Ask about security concerns",
    "Ask about deployment ownership"
  ]
}
```

---

## 5. CandidateAnswer

### Purpose

A candidate's submitted response to one question. Captures how the answer was provided (voice or text), the normalized transcript, and submission metadata.

### Created by

**Question Player** (after voice transcription or typed input).

### Consumed by

| System | Usage |
|--------|-------|
| Answer Evaluation | Primary evidence input (`transcript`) |
| Interview Session | Persisted per-question answer record |

### TypeScript

```ts
export interface CandidateAnswer {
  questionId: string
  interviewId: string
  answerMode: AnswerMode
  /** Normalized answer text — from transcription or direct typing */
  transcript: string
  durationSeconds?: number
  submittedAt: ISODateTime
}
```

### Important fields

| Field | Notes |
|-------|-------|
| `questionId` | Links answer to `InterviewQuestion.id` |
| `interviewId` | Links answer to the interview run |
| `answerMode` | `"voice"` or `"text"` — useful for analytics and UX |
| `transcript` | The text evaluated by the system; user-editable before submit in the player |
| `durationSeconds` | Optional; typically set for voice answers |
| `submittedAt` | When the answer was finalized |

### Example

```json
{
  "questionId": "q_002",
  "interviewId": "interview_001",
  "answerMode": "voice",
  "transcript": "I would start by keeping authentication centralized in the shell application. Each micro frontend would consume a shared auth contract rather than owning login state directly. Tokens would be managed at the shell layer with clear refresh boundaries, and teams would deploy independently as long as they honor the shared security interface.",
  "durationSeconds": 92,
  "submittedAt": "2026-06-02T12:04:00.000Z"
}
```

---

## 6. EvaluationResult

### Purpose

Structured assessment of a single answer against the question's expected signals. Provides per-question score, evidence analysis, confidence assessment, and coaching feedback.

### Created by

**Answer Evaluation System**.

### Consumed by

| System | Usage |
|--------|-------|
| Question Player | Inline feedback card after each question |
| Interview Session | Aggregated with answers for completion and report generation |
| Final Report | Pattern analysis across all questions |

### Evaluation input (strict MVP)

Answer Evaluation accepts **only**:

```ts
export interface AnswerEvaluationInput {
  question: string
  expectedSignals: string[]
  candidateAnswer: string
}
```

No profile, job analysis, category, or difficulty in MVP evaluation inputs. Role-fit inference is derived solely from signal coverage and answer quality against the rubric.

### TypeScript

```ts
export interface EvaluationResult {
  questionId: string
  interviewId: string
  score: Score
  strengths: string[]
  weaknesses: string[]
  /** Subset of expectedSignals not demonstrated in the answer */
  missingSignals: string[]
  confidenceLevel: ConfidenceLevel
  suggestedAnswer: string
  recommendedTopics: string[]
  evaluatedAt: ISODateTime
}
```

### Important fields

| Field | Notes |
|-------|-------|
| `score` | 0–100; reflects evidence quality against expected signals, not trivia correctness |
| `strengths` | Signals or competencies demonstrated |
| `weaknesses` | Gaps articulated in natural language |
| `missingSignals` | Explicit rubric items not addressed — machine-checkable gap list |
| `confidenceLevel` | How much confidence this answer adds for role fit |
| `suggestedAnswer` | Actionable coaching text for a stronger response |
| `recommendedTopics` | Areas to study before a real interview |

### Example

```json
{
  "questionId": "q_002",
  "interviewId": "interview_001",
  "score": 62,
  "strengths": [
    "Recognized need for centralized authentication",
    "Mentioned shared contracts between teams"
  ],
  "weaknesses": [
    "Did not discuss token refresh lifecycle",
    "Did not explain deployment independence in detail"
  ],
  "missingSignals": [
    "token management",
    "deployment considerations"
  ],
  "confidenceLevel": "Low",
  "suggestedAnswer": "A stronger answer would explain where authentication lives, how independently deployed applications consume auth data, how tokens are refreshed, and how teams remain decoupled while sharing security contracts.",
  "recommendedTopics": [
    "Authentication architecture",
    "Micro frontend boundaries",
    "Token lifecycle management"
  ],
  "evaluatedAt": "2026-06-02T12:04:30.000Z"
}
```

---

## 7. InterviewSession

### Purpose

Runtime aggregate of one interview run. Binds the generated blueprint to captured answers and evaluation results, plus progress and completion metadata. This is the primary input bundle for final report generation.

### Created by

**Question Player** (initialized from blueprint) — updated as the candidate progresses.

### Consumed by

| System | Usage |
|--------|-------|
| Final Report System | Full interview context for cross-question pattern analysis |
| Question Player | Resume-in-progress state |

### TypeScript

```ts
export interface QuestionSessionRecord {
  question: InterviewQuestion
  answer?: CandidateAnswer
  evaluation?: EvaluationResult
}

export interface InterviewSession {
  id: string
  interviewId: string
  profileId: string
  jobAnalysisId: string
  blueprint: InterviewBlueprint
  status: InterviewStatus
  startedAt?: ISODateTime
  completedAt?: ISODateTime
  /** Ordered records — one per blueprint question */
  questions: QuestionSessionRecord[]
}
```

### Important fields

| Field | Notes |
|-------|-------|
| `id` | Session record identifier (may differ from `interviewId` if sessions are retried) |
| `interviewId` | Matches `InterviewBlueprint.interviewId` |
| `profileId`, `jobAnalysisId` | Provenance links to inputs used for generation |
| `blueprint` | Immutable plan snapshot for this run |
| `status` | Lifecycle state of the interview |
| `questions` | Ordered join of question, optional answer, optional evaluation |
| `startedAt`, `completedAt` | Timing for duration and completion UX |

Per-question score rollups for UI (e.g. a summary table) are derived from `questions[].evaluation` — not stored on `FinalReport`.

### Example

```json
{
  "id": "session_001",
  "interviewId": "interview_001",
  "profileId": "profile_abc123",
  "jobAnalysisId": "job_xyz789",
  "status": "completed",
  "startedAt": "2026-06-02T11:30:00.000Z",
  "completedAt": "2026-06-02T12:15:00.000Z",
  "blueprint": {
    "interviewId": "interview_001",
    "interviewTitle": "Senior Frontend Engineer Interview",
    "estimatedDurationMinutes": 30,
    "questionCount": 2,
    "categories": ["Micro Frontends", "Leadership"],
    "questions": []
  },
  "questions": [
    {
      "question": {
        "id": "q_002",
        "order": 1,
        "category": "Micro Frontends",
        "difficulty": "Senior",
        "question": "How would you share authentication across independently deployed micro frontends?",
        "expectedSignals": [
          "shared authentication strategy",
          "ownership boundaries",
          "token management",
          "team independence",
          "deployment considerations"
        ],
        "followUpOpportunities": []
      },
      "answer": {
        "questionId": "q_002",
        "interviewId": "interview_001",
        "answerMode": "voice",
        "transcript": "I would keep auth in the shell and share contracts...",
        "durationSeconds": 92,
        "submittedAt": "2026-06-02T12:04:00.000Z"
      },
      "evaluation": {
        "questionId": "q_002",
        "interviewId": "interview_001",
        "score": 62,
        "strengths": ["Recognized need for centralized authentication"],
        "weaknesses": ["Did not discuss token refresh lifecycle"],
        "missingSignals": ["token management", "deployment considerations"],
        "confidenceLevel": "Low",
        "suggestedAnswer": "Explain centralized auth, token refresh, and deployment independence.",
        "recommendedTopics": ["Authentication architecture", "Micro frontend boundaries"],
        "evaluatedAt": "2026-06-02T12:04:30.000Z"
      }
    }
  ]
}
```

---

## 8. FinalReport

### Purpose

Cross-interview synthesis identifying patterns, role readiness, risk areas, and recommended next steps. Answers: *What did we learn about this candidate, and what should they do next?*

### Created by

**Final Report System**.

### Consumed by

| System | Usage |
|--------|-------|
| Question Player / UI | End-of-interview report screen |
| *(future)* Progress tracking | Compare reports across sessions |

### TypeScript

```ts
export interface FinalReport {
  id: string
  interviewId: string
  overallScore: Score
  readinessLevel: string
  confidence: ConfidenceLevel
  strengthAreas: string[]
  weakAreas: string[]
  riskAreas: string[]
  recommendedTopics: string[]
  summary: string
  coachingRecommendations: string[]
  studyRecommendations: string[]
  hiringManagerSummary: string
  generatedAt: ISODateTime
}
```

### Important fields

| Field | Notes |
|-------|-------|
| `overallScore` | 0–100 aggregate, same scale as per-question scores |
| `readinessLevel` | Qualitative readiness label (e.g. `"Moderately Prepared"`) |
| `confidence` | Overall confidence in the readiness assessment |
| `strengthAreas` | Recurring themes where the candidate performed well |
| `weakAreas` | Recurring struggle themes |
| `riskAreas` | Concerns a hiring manager might raise |
| `recommendedTopics` | Priority topics for further practice |
| `summary` | Candidate-facing executive summary |
| `coachingRecommendations` | Specific behavioral or communication improvements |
| `studyRecommendations` | Topic-focused study guidance |
| `hiringManagerSummary` | Third-person summary suitable for a hiring-manager perspective |

Presentation-only derivations (letter grades, per-question rollup tables) are **not** part of this contract — compute them in the UI from `InterviewSession`.

### Example

```json
{
  "id": "report_001",
  "interviewId": "interview_001",
  "overallScore": 74,
  "readinessLevel": "Moderately Prepared",
  "confidence": "Medium",
  "strengthAreas": [
    "React",
    "Design Systems",
    "Accessibility",
    "Testing"
  ],
  "weakAreas": [
    "Architecture Communication",
    "System Thinking",
    "Technical Leadership"
  ],
  "riskAreas": [
    "Answers focus on implementation rather than business impact",
    "Limited discussion of architectural tradeoffs"
  ],
  "recommendedTopics": [
    "Micro Frontends",
    "Architecture",
    "System Design"
  ],
  "summary": "Candidate demonstrates strong frontend implementation skills but should improve architectural communication and ownership-focused responses.",
  "coachingRecommendations": [
    "Practice explaining architectural tradeoffs out loud",
    "Prepare system-level examples from IBM and VoteMate",
    "Develop stronger leadership stories with measurable outcomes"
  ],
  "studyRecommendations": [
    "Micro frontend deployment strategies",
    "Frontend observability patterns",
    "System design for distributed UIs"
  ],
  "hiringManagerSummary": "Candidate demonstrates strong frontend engineering skills and would likely perform well in implementation-focused work. To compete more effectively for senior and lead-level roles, the candidate should improve architectural communication, leadership storytelling, and system-level thinking.",
  "generatedAt": "2026-06-02T12:16:00.000Z"
}
```

---

## Contract dependency matrix

| Contract | Created by | Consumed by |
|----------|------------|-------------|
| `CandidateProfile` | Profile System | Interview Generator; *(future)* Final Report |
| `JobAnalysis` | Job Analysis System | Interview Generator; Final Report |
| `InterviewBlueprint` | Interview Generator | Question Player, Interview Session, Final Report |
| `InterviewQuestion` | Interview Generator | Question Player, Answer Evaluation, Interview Session, Final Report |
| `CandidateAnswer` | Question Player | Answer Evaluation, Interview Session |
| `EvaluationResult` | Answer Evaluation | Question Player, Interview Session, Final Report |
| `InterviewSession` | Question Player | Final Report, Question Player |
| `FinalReport` | Final Report System | UI |

---

## Out of scope for MVP

Documented for future alignment — do not implement in MVP contracts unless explicitly promoted.

| Item | Notes |
|------|-------|
| Adaptive follow-up questions | `followUpOpportunities` stored but not acted on |
| Profile/job context in evaluation | Strict signal-based evaluation only |
| Multi-interview comparison | No cross-session contract yet |
| Long-term progress tracking | No learner history aggregate |
| Automated study plans | `studyRecommendations` is report text only |
| Resume rewriting / job application | Final Report is coaching output only |
| Real-time conversational interview | Question Player is slideshow-style, not dialog |
| Letter grades (`"B+"`) | UI presentation; not in `FinalReport` |
| Per-question score rollup on report | Derive from `InterviewSession.questions` in UI |

---

## Related documents

- [Feature spec: Profile System](../feature-specs/01-profile-system.md)
- [Feature spec: Job Analysis](../feature-specs/02-job-analysis.md)
- [Feature spec: Interview Generation](../feature-specs/03-interview-generation.md)
- [Feature spec: Question Player](../feature-specs/04-question-player.md)
- [Feature spec: Answer Evaluation](../feature-specs/05-answer-evaluation.md)
- [Feature spec: Final Report](../feature-specs/06-final-report.md)
- [AI Flow](../feature-specs/07-ai-flow.md)
