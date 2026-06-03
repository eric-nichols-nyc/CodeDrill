export type SeedQuestionFixture = {
  displayOrder: number;
  category: string;
  difficulty: string;
  questionText: string;
  expectedSignals: string[];
  followUpOpportunities: string[];
};

export const SEED_INTERVIEW_TITLE = "Senior Frontend Engineer Interview";
export const SEED_ESTIMATED_DURATION_MINUTES = 30;
export const SEED_CATEGORIES = [
  "React & Hooks",
  "Performance Optimization",
  "TypeScript",
];

export const SEED_QUESTIONS: SeedQuestionFixture[] = [
  {
    displayOrder: 1,
    category: "React & Hooks",
    difficulty: "Senior",
    questionText:
      "Can you explain the difference between `useEffect` and `useLayoutEffect`, and describe a scenario where you'd choose one over the other?",
    expectedSignals: [
      "timing difference between useEffect and useLayoutEffect",
      "useLayoutEffect runs before browser paint",
      "concrete scenario such as measuring DOM or preventing flicker",
      "when useEffect is the better default",
    ],
    followUpOpportunities: [
      "Ask about SSR implications",
      "Ask about performance trade-offs",
    ],
  },
  {
    displayOrder: 2,
    category: "Performance Optimization",
    difficulty: "Senior",
    questionText:
      "Walk me through how you'd diagnose and fix a React component that's re-rendering too frequently, causing performance issues.",
    expectedSignals: [
      "React DevTools Profiler or equivalent",
      "React.memo, useMemo, useCallback",
      "context splitting or state colocation",
      "list virtualization for large lists",
    ],
    followUpOpportunities: [
      "Ask about measuring before and after",
    ],
  },
  {
    displayOrder: 3,
    category: "TypeScript",
    difficulty: "Senior",
    questionText:
      "How would you type a generic fetch utility function in TypeScript that handles both success and error states in a type-safe way?",
    expectedSignals: [
      "generic type parameter for response data",
      "discriminated union or Result type",
      "caller must handle both branches",
    ],
    followUpOpportunities: [
      "Ask about error narrowing",
    ],
  },
];
