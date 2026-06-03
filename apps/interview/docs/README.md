# Interview app docs

Developer notes for **`apps/interview`** (AI Interview Coach zone).

## Start here

| Doc | Description |
|-----|-------------|
| [planning-checklist.md](./planning-checklist.md) | Planning pipeline (order of docs) + Interview Coach status |
| [prd.md](./prd.md) | Product requirements — MVP features, screens, out of scope |
| [AGENTS.md](./AGENTS.md) | Agent entry point and read order |
| [context/progress-tracker.md](./context/progress-tracker.md) | Current phase and session notes |

## Spec pack

| Doc | Description |
|-----|-------------|
| [feature-specs/](./feature-specs/) | Per-system specs (profile, job analysis, generator, player, evaluation, report, AI flow) |
| [implementation/03-job-analysis-implementation.md](./implementation/03-job-analysis-implementation.md) | Job Analysis vertical slice — phases, API, checklist |
| [architecture/overview.md](./architecture/overview.md) | Systems, journey, MVP boundaries |
| [architecture/ai-flow.md](./architecture/ai-flow.md) | Intelligent steps — inputs, outputs, consumers |
| [architecture/data-contracts.md](./architecture/data-contracts.md) | TypeScript contracts between systems |
| [architecture/database.md](./architecture/database.md) | MVP schema (from contracts) |
| [architecture/api-contracts.md](./architecture/api-contracts.md) | API/actions (planned — step 8) |

## Context

| Doc | Description |
|-----|-------------|
| [context/project-overview.md](./context/project-overview.md) | Goals and core flow summary |
| [context/architecture.md](./context/architecture.md) | Stack, zone app, env |
| [context/ai-workflow-rules.md](./context/ai-workflow-rules.md) | Day-to-day scoping and doc sync |

Static prototype — single flow at `/interview` (create → overview → question → feedback → report).

| Route | Screen |
|-------|--------|
| `/` | Landing |
| `/interview` | Full prototype flow (`InterviewCoach`) |
