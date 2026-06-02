# Project Overview

## Summary

**AI Interview Coach** helps engineers prepare for interviews with personalized mock sessions built from a resume and target job description. Users practice **speaking answers aloud**, receive **per-question feedback**, and finish with a **final report** — not a free-form chatbot.

## Goals

1. Generate a tailored interview plan in under two minutes.
2. Simulate realistic, role-specific questions tied to the candidate's experience.
3. Coach through voice practice with actionable feedback and study recommendations.

## Core User Flow

1. Upload resume → build candidate profile
2. Paste job description → analyze role requirements
3. Generate 5–10 targeted questions
4. Answer each question by voice → transcript → evaluation
5. Review final report and save progress (future)

## Current Phase

**Static UI prototype** — five MVP screens with mock content, no backend.

## Out of Scope (now)

Clerk auth, database persistence, resume parsing, job URL scraping, voice recording, LLM evaluation, and multi-zone rewrites on `apps/app` host.

See [prd.md](../prd.md) for full MVP and future vision.
