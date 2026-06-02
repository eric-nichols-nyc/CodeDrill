# AI Interview Coach

## Overview

AI Interview Coach is a personalized interview preparation platform that generates realistic mock interviews based on a candidate's resume and a target job description.

The application helps users practice speaking answers out loud, receive targeted feedback, identify knowledge gaps, and improve confidence before real interviews.

The MVP focuses on a guided interview experience rather than a conversational chatbot.

---

## Problem Statement

Interview preparation is difficult because:

* Most interview questions are generic.
* Candidates struggle to identify weak areas.
* Practicing silently is very different from speaking answers out loud.
* Existing AI tools often provide shallow feedback.
* Few tools tailor questions to both a specific resume and a specific job description.

Users need a way to simulate realistic interviews and receive actionable coaching.

---

## Target Users

Primary Users:

* Frontend Engineers
* Full Stack Engineers
* Software Engineers
* Engineering Leads

Secondary Users:

* Career changers
* Recent graduates
* Technical professionals preparing for interviews

---

## Product Vision

Allow users to generate a personalized mock interview in under two minutes.

The interview should:

* Feel realistic
* Focus on the user's actual experience
* Challenge weak areas
* Encourage verbal practice
* Produce actionable feedback

---

## Success Criteria

A user can:

1. Upload a resume
2. Paste a job description
3. Generate a targeted interview
4. Answer questions by voice
5. Receive feedback after each question
6. Review a final interview report
7. Save results for future practice

---

## Core User Flow

Resume Upload
↓
Profile Generation
↓
Job Description Input
↓
Interview Generation
↓
Question Player
↓
Voice Answer
↓
Transcript
↓
Evaluation
↓
Next Question
↓
Final Report

---

## MVP Features

### 1. Candidate Profile

**Description**

User uploads a resume.

The system extracts:

* Candidate summary
* Skills
* Projects
* Resume claims
* Potential knowledge gaps

**Goal**

Create interview context.

---

### 2. Job Analysis

**Description**

User pastes:

* Job description
* OR job posting URL

The system extracts:

* Required skills
* Seniority level
* Key technologies
* Interview focus areas

**Goal**

Create job context.

---

### 3. Interview Generation

**Description**

Generate 5–10 interview questions based on:

* Resume profile
* Job description

Questions should:

* Verify resume claims
* Test required skills
* Probe likely weaknesses
* Match job seniority

**Goal**

Create a realistic interview plan.

---

### 4. Interview Player

**Description**

Display one question at a time.

User can:

* View question
* Record answer
* Review transcript
* Submit answer

**Goal**

Create focused interview practice.

---

### 5. Answer Evaluation

**Description**

Evaluate user response.

Generate:

* Score
* Strengths
* Weaknesses
* Missing concepts
* Suggested answer
* Recommended study topics

**Goal**

Provide actionable coaching.

---

### 6. Final Report

**Description**

Generate interview summary.

Include:

* Overall score
* Strong areas
* Weak areas
* Red flags
* Questions to revisit
* Study recommendations

**Goal**

Help users improve over time.

---

## MVP Screens

### Screen 1 — Create Interview

Fields:

* Resume Upload
* Job Description
* Difficulty Selector

Actions:

* Generate Interview

---

### Screen 2 — Interview Overview

Display:

* Company
* Role
* Topics Covered
* Question Count
* Estimated Duration

Actions:

* Start Interview

---

### Screen 3 — Question Player

Display:

* Current Question
* Progress Indicator

Actions:

* Start Recording
* Stop Recording
* Submit Answer

---

### Screen 4 — Feedback

Display:

* Score
* Strengths
* Weaknesses
* Suggested Answer

Actions:

* Next Question

---

### Screen 5 — Final Report

Display:

* Overall Score
* Strong Areas
* Weak Areas
* Recommended Study Topics
* Retake Interview

---

## Data To Persist

Store:

* User Profile
* Resume Summary
* Interview Sessions
* Questions
* Answers
* Feedback
* Scores

Purpose:

Enable progress tracking and future practice.

---

## Out of Scope (MVP)

The following features are explicitly excluded:

* Real-time conversational interviewer
* AI avatars
* Multi-round interview loops
* Recruiter personas
* Architect personas
* Engineering manager personas
* Live interruptions
* Team collaboration
* Vector databases
* Adaptive learning paths
* Interview scheduling
* Resume rewriting

These features may be considered in future versions.

---

## Open Questions

The prototype should help answer:

* Should feedback appear after every question?
* Should users see their transcript?
* Should answers be retryable?
* Should follow-up questions exist in MVP?
* Should interviews be timed?
* Should users be allowed to skip questions?

---

## Future Vision

Future versions may include:

* Dynamic follow-up questions
* Interview personas
* Full voice interviewer
* Conversation mode
* Progress analytics
* Company-specific interview tracks
* AI-generated study plans
* Personalized interview coaching

---

## Guiding Principle

This product is not a chatbot.

This product is a personalized interview practice system that combines:

Resume
+
Job Description
+
Voice Practice
+
Targeted Feedback

to help users improve interview performance and confidence.
