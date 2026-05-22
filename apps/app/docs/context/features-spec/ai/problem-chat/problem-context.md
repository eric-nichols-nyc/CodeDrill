
**`problem-context.md`**
```md
# Problem Context Strategy

## Purpose

The AI tutor needs structured context about the active coding problem so it can give relevant, accurate, and consistent guidance.

For v1, build this context from the existing database-backed problem data.
Do not require markdown files for the first implementation.

---

## V1 Problem Context

```ts
type ProblemContext = {
  id: string;
  title: string;
  slug: string;
  difficulty: "easy" | "medium" | "hard";

  description: string;
  constraints?: string | null;

  examples: ProblemExample[];

  starterCode?: {
    language: string;
    code: string;
    functionName?: string | null;
  }[];

  solutionCode?: {
    language: string;
    code: string;
    explanation?: string | null;
    timeComplexity?: string | null;
    spaceComplexity?: string | null;
  }[];

  patternTags?: string[];
  relatedConcepts?: string[];
  commonMistakes?: string[];
  hiddenInsights?: string[];

  tutorLevel?: "beginner" | "intermediate" | "advanced" | string | null;
};