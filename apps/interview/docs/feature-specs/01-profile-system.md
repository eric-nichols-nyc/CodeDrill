# Profile System

## Purpose

The Profile System converts a user's resume into structured interview context that can be used by the Interview Generator and Evaluation System.

The goal is not simply to store the resume. The goal is to understand the candidate well enough to generate realistic, resume-specific interview questions.

---

## Inputs

- Resume file
- Parsed resume text
- Optional manually edited profile fields

---

## AI Extraction Output

### Candidate Summary

Eric is a senior frontend developer with 11+ years of experience building React, TypeScript, Next.js, design system, and AI-powered applications. His background includes enterprise platforms, component libraries, micro frontend architecture, accessibility, and chatbot interfaces.

---

### Core Skills

```json
[
  "React",
  "TypeScript",
  "Next.js",
  "Storybook",
  "Design Systems",
  "Micro Frontends",
  "Accessibility",
  "Playwright",
  "AI Integrations"
]
```

---

### Project Experience

```json
[
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
]
```

---

### Resume Claims To Verify

```json
[
  {
    "claim": "Implemented Playwright tests for chatbot interactions",
    "questionAngle": "Ask for a concrete testing example"
  },
  {
    "claim": "Led frontend architecture for IBM platform",
    "questionAngle": "Ask about scalability, permissions, and ownership boundaries"
  }
]
```

---

### Strength Areas

```json
[
  "React component architecture",
  "Storybook and design systems",
  "Accessibility",
  "Frontend UI development",
  "AI product interfaces"
]
```

---

### Potential Gap Areas

```json
[
  "frontend observability",
  "state machines",
  "production monitoring",
  "deep micro frontend deployment strategy"
]
```

---

## How Other Systems Use This

### Interview Generator

Uses profile data to create targeted questions.

### Evaluation System

Uses profile claims to grade answers and identify weak areas.

---

## MVP Version

1. Upload resume
2. Extract resume text
3. Generate structured profile
4. Save profile
5. Allow user to review/edit profile later
