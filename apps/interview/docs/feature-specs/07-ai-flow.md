# AI Flow Architecture

## Purpose

The AI Flow defines how information moves through the system.

It documents:

* What each AI call receives
* What each AI call returns
* How systems communicate
* How interview intelligence is generated

The AI Flow is the blueprint for all AI interactions within the application.

---

## System Flow

```txt
Resume
↓
Profile System
↓
Candidate Profile

Job Description
↓
Job Analysis System
↓
Job Analysis

Candidate Profile
+
Job Analysis
↓
Interview Generator
↓
Interview Blueprint

Question
+
Expected Signals
+
Candidate Answer
↓
Answer Evaluation
↓
Evaluation Result

Interview
+
Evaluation Results
↓
Final Report
↓
Interview Summary
```

---

## Flow 1: Profile Generation

### Profile generation input

```json
{
  "resumeText": "..."
}
```

---

### Profile generation task

Analyze the resume and generate a structured candidate profile.

---

### Profile generation output

```ts
type CandidateProfile = {
  summary: string
  coreSkills: string[]
  projects: Project[]
  claimsToVerify: Claim[]
  strengthAreas: string[]
  potentialGapAreas: string[]
}
```

---

## Flow 2: Job Analysis

### Job analysis input

```json
{
  "jobDescription": "..."
}
```

---

### Job analysis task

Analyze the job description and identify:

* Required skills
* Nice-to-have skills
* Seniority level
* Hidden expectations
* Interview categories
* What the candidate must prove

---

### Job analysis output

```ts
type JobAnalysis = {
  roleSummary: string
  requiredSkills: string[]
  niceToHaveSkills: string[]
  seniorityLevel: string
  interviewCategories: string[]
  hiddenExpectations: string[]
  mustProve: string[]
}
```

---

## Flow 3: Interview Generation

### Interview generation input

```json
{
  "candidateProfile": {},
  "jobAnalysis": {}
}
```

---

### Interview generation task

Generate an interview blueprint that collects evidence needed to
evaluate role fit.

---

### Interview generation output

```ts
type InterviewBlueprint = {
  title: string
  estimatedDuration: number
  categories: string[]
  questions: InterviewQuestion[]
}
```

---

## Flow 4: Answer Evaluation

### Answer evaluation input

```json
{
  "question": {},
  "expectedSignals": [],
  "candidateAnswer": "..."
}
```

---

### Answer evaluation task

Evaluate whether the answer provides evidence that the candidate
satisfies role expectations.

---

### Answer evaluation output

```ts
type EvaluationResult = {
  score: number
  strengths: string[]
  weaknesses: string[]
  missingSignals: string[]
  confidenceLevel: string
  suggestedAnswer: string
  recommendedTopics: string[]
}
```

---

## Flow 5: Final Report

### Final report input

```json
{
  "interview": {},
  "evaluationResults": []
}
```

---

### Final report task

Analyze the entire interview and identify patterns.

---

### Final report output

```ts
type FinalReport = {
  overallScore: number
  readinessLevel: string
  strengthAreas: string[]
  weakAreas: string[]
  riskAreas: string[]
  recommendedTopics: string[]
  summary: string
}
```

---

## Design Principles

### Structured outputs

Every AI call should return structured JSON.

Avoid free-form text whenever possible.

---

### Single responsibility

Each AI call should perform one job only.

Bad:

```txt
Analyze resume
Generate interview
Evaluate candidate
```

Good:

```txt
Analyze resume
```

---

### Predictable contracts

Each system should know:

```txt
What it receives
What it returns
```

without needing to understand internal AI logic.

---

## Guiding principle

Every AI call should answer one question.

```txt
Profile System
→ Who is the candidate?

Job Analysis System
→ What does the company need?

Interview Generator
→ What evidence should we collect?

Answer Evaluation System
→ Did the candidate provide sufficient evidence?

Final Report System
→ What patterns emerged and what should the candidate do next?
```
