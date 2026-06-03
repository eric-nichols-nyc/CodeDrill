# Repo Planning Checklist

Playbook for planning **`apps/interview`** (and similar zone apps). Use this when starting greenfield work or adding a major system. Day-to-day state lives in [context/progress-tracker.md](./context/progress-tracker.md); tactical rules in [context/ai-workflow-rules.md](./context/ai-workflow-rules.md).

---

## Interview Coach — current status

| Step | Artifact | Status |
|------|----------|--------|
| 1. Product | [prd.md](./prd.md) | Done |
| 2. Static prototype | `/interview` flow + mock data | Done |
| 3. Major systems | [feature-specs/](./feature-specs/) (01–07) | Done |
| 4. Architecture overview | [architecture/overview.md](./architecture/overview.md) | Done |
| 5. AI / business flow | [architecture/ai-flow.md](./architecture/ai-flow.md) | Done |
| 6. Data contracts | [architecture/data-contracts.md](./architecture/data-contracts.md) | Done |
| 7. Database model | [architecture/database.md](./architecture/database.md) | Done |
| 8. API / action contracts | [architecture/api-contracts.md](./architecture/api-contracts.md) | **Not started** |
| 9. First vertical slice | UI → action → DB → screen | **Not started** |
| 10. System-by-system implementation | See recommended order below | In progress (static UI only) |
| 11. MVP cutline | [prd.md](./prd.md) § scope | Done (keep in sync) |

---

## 1. Define The Product

- [ ] What problem does this solve?
- [ ] Who is the user?
- [ ] What is the core outcome?
- [ ] What does the MVP do?
- [ ] What is explicitly out of scope?

Create:

```txt
apps/interview/docs/prd.md
```

---

## 2. Build A Static Prototype

- [ ] Create the main screens
- [ ] Use hardcoded data
- [ ] Avoid database/API/AI logic
- [ ] Click through the full experience
- [ ] Note what feels confusing, unnecessary, or missing

Goal:

```txt
Validate the experience before implementation.
```

Prototype: `apps/interview/features/prototype/`, route `/interview`.

---

## 3. Define Major Systems

Ask:

```txt
What are the responsibilities?
```

Example (Interview Coach):

```txt
Profile System
Job Analysis System
Interview Generator
Question Player
Evaluation System
Reporting System
```

For each system:

- [ ] Purpose
- [ ] Inputs
- [ ] Outputs
- [ ] Responsibilities
- [ ] MVP scope
- [ ] Out of scope

Create:

```txt
apps/interview/docs/feature-specs/
```

Index: [feature-specs/01-profile-system.md](./feature-specs/01-profile-system.md) through [07-ai-flow.md](./feature-specs/07-ai-flow.md).

---

## 4. Create Architecture Overview

- [ ] What are the major systems?
- [ ] How do they interact?
- [ ] What is the core user journey?
- [ ] What are the MVP boundaries?
- [ ] What are the architectural principles?

Create:

```txt
apps/interview/docs/architecture/overview.md
```

Stack / zone boundaries: [context/architecture.md](./context/architecture.md).

---

## 5. Define AI Flow / Business Flow

- [ ] What does each intelligent step receive?
- [ ] What does each step return?
- [ ] What decision is each step making?
- [ ] What system consumes the output?

Create:

```txt
apps/interview/docs/architecture/ai-flow.md
```

---

## 6. Define Data Contracts

Do this **before** database/API routes.

For each contract:

- [ ] Purpose
- [ ] Created by
- [ ] Consumed by
- [ ] TypeScript interface
- [ ] Example object

Examples:

```txt
CandidateProfile
JobAnalysis
InterviewBlueprint
Question
Answer
EvaluationResult
FinalReport
```

Create:

```txt
apps/interview/docs/architecture/data-contracts.md
```

---

## 7. Define Database Model

Use data contracts to decide what persists.

Ask:

- [ ] What must be stored?
- [ ] What is temporary?
- [ ] What can be regenerated?
- [ ] What relationships exist?
- [ ] What is the simplest MVP schema?

Create:

```txt
apps/interview/docs/architecture/database.md
```

---

## 8. Define API / Action Contracts

For each action:

- [ ] Name
- [ ] Purpose
- [ ] Input
- [ ] Output
- [ ] Errors
- [ ] Auth requirement
- [ ] What system owns it

Create:

```txt
apps/interview/docs/architecture/api-contracts.md
```

---

## 9. Build One Vertical Slice

Do not build the whole app.

Start with the smallest complete flow:

```txt
UI
↓
Action/API
↓
Database
↓
Result on screen
```

Example:

```txt
/profile
↓
paste resume
↓
generate profile
↓
save profile
↓
show saved profile
```

---

## 10. Implement System By System

Recommended order:

- [ ] Static UI/prototype
- [ ] Profile System
- [ ] Job Analysis System
- [ ] Interview Generator
- [ ] Question Player
- [ ] Evaluation System
- [ ] Final Report System

Map to [feature-specs/](./feature-specs/) and [context/progress-tracker.md](./context/progress-tracker.md).

---

## 11. Keep A Cutline

Before building, write:

```txt
MVP includes:
```

and

```txt
MVP does not include:
```

Feature creep starts when this is missing. Source of truth: [prd.md](./prd.md).

---

## 12. Rule Of Thumb

Never jump straight from:

```txt
Idea → Code
```

Use:

```txt
Idea
↓
Prototype
↓
PRD
↓
Systems
↓
Architecture
↓
Data Contracts
↓
Database/API
↓
Vertical Slice
↓
Implementation
```

---

## Doc map

| Phase | Path |
|-------|------|
| Product | [prd.md](./prd.md) |
| Systems | [feature-specs/](./feature-specs/) |
| Architecture | [architecture/overview.md](./architecture/overview.md) |
| AI flow | [architecture/ai-flow.md](./architecture/ai-flow.md) |
| Data | [architecture/data-contracts.md](./architecture/data-contracts.md) |
| Persistence | [architecture/database.md](./architecture/database.md) |
| API | [architecture/api-contracts.md](./architecture/api-contracts.md) (planned) |
| Live state | [context/progress-tracker.md](./context/progress-tracker.md) |
