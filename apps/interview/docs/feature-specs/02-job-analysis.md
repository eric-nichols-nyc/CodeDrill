# Job Analysis System

**Goal:** Convert a raw job description (and optional metadata) into structured interview intelligence (`JobAnalysis`) for the Interview Generator.

**Depends on:** Authenticated user session; optional `companyName` / `roleTitle` from UI.

**Blocks:** Interview Generator (Stage 3).

**Out of scope (this system):** Interview questions, candidate scoring, resume comparison, per-answer or final feedback — owned by Generator, Evaluation, and Final Report.

**Implementation plan:** [03-job-analysis-implementation.md](../implementation/03-job-analysis-implementation.md)

---

## Purpose

The Job Analysis System converts a raw job description into structured interview intelligence.

Its purpose is to determine:

* What the company needs
* What the role requires
* What the candidate must prove
* What topics will likely be tested
* What hidden expectations exist

The output of this system is used by the Interview Generator to create targeted interview questions.

---

# Inputs

* Job Description
* Optional Job URL
* Company Name
* Role Title

---

# Outputs

## Role Summary

A concise summary of the role and its primary responsibilities.

Example:

```txt
Senior Frontend Engineer focused on React,
TypeScript, Micro Frontends, Design Systems,
and enterprise-scale frontend architecture.
```

---

## Required Skills

Skills explicitly required by the job posting.

Example:

```json
[
  "React",
  "TypeScript",
  "Micro Frontends",
  "Design Systems",
  "Accessibility",
  "Testing"
]
```

---

## Nice To Have Skills

Skills that are preferred but not required.

Example:

```json
[
  "AWS",
  "GraphQL",
  "CI/CD",
  "Performance Monitoring"
]
```

---

## Seniority Level

Determine the likely experience level expected.

Example:

```json
{
  "level": "Senior",
  "confidence": "High"
}
```

---

## Likely Interview Categories

Areas most likely to be covered during interviews.

Example:

```json
[
  "React Architecture",
  "Micro Frontends",
  "Design Systems",
  "Frontend Performance",
  "Testing",
  "Leadership",
  "Cross-Team Collaboration"
]
```

---

## What The Candidate Must Prove

The most important section.

This represents what the hiring team is trying to validate.

Example:

```json
[
  "Can design scalable frontend architecture",
  "Can work independently",
  "Can mentor other developers",
  "Can make technical tradeoff decisions",
  "Can collaborate across teams",
  "Can own delivery of large features"
]
```

---

## Hidden Expectations

Requirements that are implied but not explicitly stated.

Example:

```json
[
  {
    "expectation": "Architecture ownership",
    "reason": "Role emphasizes scalable frontend systems and micro frontends"
  },
  {
    "expectation": "Cross-team communication",
    "reason": "Role requires collaboration across engineering, product, and design"
  },
  {
    "expectation": "Technical leadership",
    "reason": "Senior title and mentoring responsibilities"
  }
]
```

---

## Interview Signals

The traits interviewers are likely trying to validate.

Example:

```json
[
  "Depth of React knowledge",
  "System thinking",
  "Decision making",
  "Ownership",
  "Communication",
  "Problem solving"
]
```

---

## Suggested Question Angles

Question directions that the Interview Generator can use.

Example:

```json
[
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
]
```

---

# How Other Systems Use This

## Interview Generator

Receives:

```txt
Profile System Output
+
Job Analysis Output
```

And determines:

```txt
What questions will best determine
whether this candidate can satisfy
the expectations of this role?
```

---

## Acceptance criteria

- [ ] Input accepts **`jobDescription`** (required) plus optional **`jobUrl`**, **`companyName`**, and **`roleTitle`**.
- [ ] AI output conforms to **`JobAnalysis`** in [data-contracts.md](../architecture/data-contracts.md) §2 (field names and shapes, not ad-hoc aliases).
- [ ] Response includes **`roleSummary`**, **`requiredSkills`**, **`niceToHaveSkills`**, and **`seniorityLevel`** with `{ level, confidence }`.
- [ ] Response includes **`likelyInterviewCategories`**, **`mustProve`**, **`hiddenExpectations`** (`expectation` + `reason`), **`interviewSignals`**, and **`suggestedQuestionAngles`** (`category` + `angle`).
- [ ] **`mustProve`** reflects hiring validation intent (what a strong candidate must demonstrate), not a generic JD summary.
- [ ] Persisted row in **`job_analyses`** stores raw JD text and structured JSON per [database.md](../architecture/database.md).
- [ ] Interview Generator can consume saved analysis without re-running extraction for the same inputs.
- [ ] No interview questions, candidate scores, resume-to-JD comparison, or evaluation feedback in this pipeline step.

---

## Out of scope (other systems)

- Interview question text — **Interview Generator**
- Candidate scoring and answer grading — **Answer Evaluation**
- Resume alignment / gap analysis vs JD — **Profile System** + **Final Report**
- Session feedback and readiness narrative — **Final Report**

---

## Guiding Principle

The Job Analysis System does not summarize jobs.

The Job Analysis System thinks like a hiring manager.

Its purpose is to answer:

"What would a strong candidate need to demonstrate in order to get hired for this role?"
