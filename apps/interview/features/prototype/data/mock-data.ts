export type MockQuestionFeedback = {
  score: number;
  strengths: string[];
  missingConcepts: string[];
  suggestedAnswer: string;
};

export type MockQuestion = {
  id: number;
  topic: string;
  question: string;
  sampleTranscript: string;
  feedback: MockQuestionFeedback;
};

export const mockInterview = {
  jobTitle: "Senior Frontend Engineer",
  company: "Stripe",
  difficulty: "Medium",
  estimatedTime: "25–30 min",
  totalQuestions: 7,
  topics: [
    "React & Hooks",
    "TypeScript",
    "Performance Optimization",
    "System Design",
    "CSS & Accessibility",
    "Testing Strategies",
  ],
} as const;

export const mockQuestions: MockQuestion[] = [
  {
    id: 1,
    topic: "React & Hooks",
    question:
      "Can you explain the difference between `useEffect` and `useLayoutEffect`, and describe a scenario where you'd choose one over the other?",
    sampleTranscript:
      "Sure! So `useEffect` runs asynchronously after the browser has painted the screen, which makes it great for most side effects like data fetching or subscriptions. On the other hand, `useLayoutEffect` fires synchronously after all DOM mutations but before the browser paints. I'd use `useLayoutEffect` when I need to read layout from the DOM and then synchronously re-render — for example, measuring a tooltip's position and repositioning it to avoid overflow. Using `useEffect` in that case would cause a flicker because the user would briefly see the incorrectly positioned tooltip. I learned this the hard way when building a custom dropdown component at my last job.",
    feedback: {
      score: 82,
      strengths: [
        "Clearly explained the timing difference between the two hooks",
        "Provided a concrete, realistic real-world use case",
        "Demonstrated personal experience with the concept",
      ],
      missingConcepts: [
        "Didn't mention server-side rendering (SSR) implications — `useLayoutEffect` throws a warning in SSR contexts",
        "Could have touched on the performance trade-offs more explicitly",
      ],
      suggestedAnswer:
        "`useEffect` runs after the paint (async), while `useLayoutEffect` runs after DOM mutations but before paint (sync). Use `useLayoutEffect` when you need to measure the DOM or prevent visual flicker — e.g., repositioning a tooltip or syncing scroll position. Importantly, `useLayoutEffect` should be avoided in SSR contexts as it causes a React warning; you'd use `useEffect` with a conditional check instead. For 95% of use cases, `useEffect` is the right choice and has better performance characteristics.",
    },
  },
  {
    id: 2,
    topic: "Performance Optimization",
    question:
      "Walk me through how you'd diagnose and fix a React component that's re-rendering too frequently, causing performance issues.",
    sampleTranscript:
      "I'd start by opening the React DevTools Profiler to identify which components are re-rendering and why. Common culprits include object or function references being recreated on each render. Once I've pinpointed the issue, I'd use React.memo to wrap pure functional components, useMemo for expensive computations, and useCallback for functions passed as props. I'd also check if context is being overused — splitting context providers can prevent unnecessary re-renders across the tree.",
    feedback: {
      score: 75,
      strengths: [
        "Mentioned React DevTools Profiler — shows awareness of tooling",
        "Covered the main optimization hooks correctly",
        "Noted context splitting as an advanced technique",
      ],
      missingConcepts: [
        "Didn't mention key prop issues or list rendering optimizations",
        "Could have discussed virtualization for long lists (react-window/virtual)",
        "No mention of Chrome Performance tab for broader analysis",
      ],
      suggestedAnswer:
        "Start with the React DevTools Profiler to identify hot components. Check for: unstable references (fix with useMemo/useCallback), unnecessary re-renders from parent state (fix with React.memo), context overuse (split providers), and large lists (virtualize with react-window). Validate fixes by re-profiling. Also check the Chrome Performance tab for paint and layout bottlenecks beyond just React.",
    },
  },
  {
    id: 3,
    topic: "TypeScript",
    question:
      "How would you type a generic fetch utility function in TypeScript that handles both success and error states in a type-safe way?",
    sampleTranscript:
      "I'd use a generic function with a type parameter T representing the expected response data. The function would return a union type or a discriminated union — something like a Result type with either a data field or an error field. This way the caller has to handle both cases explicitly. I've also used libraries like neverthrow for this pattern in production.",
    feedback: {
      score: 70,
      strengths: [
        "Correctly identified the need for generics",
        "Mentioned discriminated unions as a pattern",
        "Referenced a real-world library (neverthrow)",
      ],
      missingConcepts: [
        "Didn't provide a concrete type definition or code example",
        "Missed discussing error narrowing with type guards",
        "No mention of async/await typing or Promise<T> return types",
      ],
      suggestedAnswer:
        "```ts\ntype Result<T> = { success: true; data: T } | { success: false; error: Error };\n\nasync function fetchData<T>(url: string): Promise<Result<T>> {\n  try {\n    const res = await fetch(url);\n    if (!res.ok) throw new Error(res.statusText);\n    const data: T = await res.json();\n    return { success: true, data };\n  } catch (error) {\n    return { success: false, error: error as Error };\n  }\n}\n```\nThis forces callers to handle both states via the discriminated union.",
    },
  },
  {
    id: 4,
    topic: "CSS & Accessibility",
    question:
      "Describe how you'd implement a fully accessible modal dialog, including keyboard navigation, focus trapping, and ARIA attributes.",
    sampleTranscript:
      "An accessible modal needs a few things. First, when it opens, focus should move into the dialog. While it's open, Tab and Shift+Tab should cycle only through focusable elements within the modal — that's focus trapping. Pressing Escape should close it. The backdrop should not be focusable. I'd use role equals dialog and aria-modal equals true, plus aria-labelledby pointing to the dialog title. When closed, focus should return to the element that triggered the modal.",
    feedback: {
      score: 88,
      strengths: [
        "Covered focus management on open and close — often missed",
        "Correctly identified key ARIA attributes",
        "Mentioned Escape key behavior",
        "Strong understanding of focus trapping mechanics",
      ],
      missingConcepts: [
        "Didn't mention inert attribute or aria-hidden for content behind the modal",
        "Could mention using a library like Radix UI or Headless UI that handles this by default",
      ],
      suggestedAnswer:
        "A fully accessible modal needs: (1) role='dialog' + aria-modal='true' + aria-labelledby pointing to the title; (2) focus moved into the dialog on open; (3) Tab/Shift+Tab trapped within focusable elements; (4) Escape closes the dialog; (5) focus returns to the trigger on close; (6) background content marked aria-hidden='true' or using the inert attribute to prevent screen reader access. Using Radix UI's Dialog or Headless UI handles most of this automatically.",
    },
  },
  {
    id: 5,
    topic: "System Design",
    question:
      "How would you architect a real-time collaborative editing feature (like Google Docs) in a React frontend?",
    sampleTranscript:
      "I'd use Operational Transformation or CRDTs for conflict resolution on the backend. On the frontend, I'd establish a WebSocket connection to receive real-time updates from other users. Each keystroke would be sent as an operation, and the local state would be updated optimistically. I'd show collaborator cursors using their position data, and use a library like Y.js which implements CRDTs and has great React integrations.",
    feedback: {
      score: 79,
      strengths: [
        "Correctly identified CRDTs and OT as the core algorithms",
        "Mentioned WebSockets for real-time transport",
        "Recommended Y.js — a production-proven library",
        "Touched on optimistic updates",
      ],
      missingConcepts: [
        "Didn't discuss offline support or conflict resolution on reconnect",
        "No mention of presence awareness beyond cursor positions",
        "Could discuss debouncing operations before sending to reduce network traffic",
      ],
      suggestedAnswer:
        "Use Y.js (CRDT) for conflict-free merging + a WebSocket provider (like y-websocket or Liveblocks). Each client has a local Y.Doc that syncs via WebSocket. Show presence (cursors, selections) via awareness protocol. Handle offline by syncing on reconnect using Y.js's update vector. Debounce or batch operations before transmitting. Integrate with tiptap or Quill for the rich text editor binding.",
    },
  },
  {
    id: 6,
    topic: "Testing Strategies",
    question:
      "What's your approach to testing a complex form component with multiple validation rules and async submission?",
    sampleTranscript:
      "I'd use React Testing Library since it tests behavior rather than implementation. For the form, I'd write tests that simulate user interactions — typing into fields, submitting the form, checking for error messages. For async submission, I'd mock the API call using MSW or jest.fn, and use waitFor to handle async assertions. I'd also write unit tests for the validation logic separately since it's pure logic.",
    feedback: {
      score: 85,
      strengths: [
        "Preferred RTL over Enzyme — modern and correct approach",
        "Mentioned MSW for API mocking — best practice",
        "Smart separation of unit tests for pure validation logic",
        "Mentioned waitFor for async testing",
      ],
      missingConcepts: [
        "Didn't mention accessibility testing (e.g., checking that errors are announced to screen readers)",
        "Could discuss e2e tests with Playwright/Cypress for critical form flows",
      ],
      suggestedAnswer:
        "Use React Testing Library to test user-facing behavior. Test each validation rule by simulating invalid inputs and asserting error messages appear. For async submission, use MSW to mock the API endpoint and waitFor to assert success/error states. Separate pure validation logic into utils and test with Vitest/Jest. Add e2e tests with Playwright for the critical happy path. Also test that error messages are properly announced via aria-live regions.",
    },
  },
  {
    id: 7,
    topic: "React & Hooks",
    question:
      "Explain how you'd implement infinite scroll in React without a third-party library, using the Intersection Observer API.",
    sampleTranscript:
      "I'd use the Intersection Observer API to watch a sentinel element at the bottom of the list. When it enters the viewport, I'd trigger a fetch for the next page. In React, I'd create a useIntersectionObserver custom hook that sets up the observer and returns whether the element is visible. The main component would call this hook with a ref on the sentinel element, and in a useEffect, watch for when it becomes visible to load more data. I'd also track a loading state and a hasMore flag to prevent duplicate requests.",
    feedback: {
      score: 91,
      strengths: [
        "Excellent approach using Intersection Observer — native and performant",
        "Thought to extract logic into a custom hook — clean architecture",
        "Mentioned loading state and hasMore flag — important edge cases",
        "Great understanding of the sentinel element pattern",
      ],
      missingConcepts: [
        "Didn't mention cleanup of the observer on unmount",
        "Could mention threshold and rootMargin options for pre-loading",
      ],
      suggestedAnswer:
        "Create a sentinel <div> at the list bottom. In a useIntersectionObserver hook, set up an IntersectionObserver on the element's ref, update a state variable when it intersects, and clean up with observer.disconnect() on unmount. In the parent, watch the intersection state in useEffect to trigger fetchNextPage(). Guard with isLoading and hasMore flags. Use rootMargin='200px' to pre-load before the user reaches the bottom for smoother UX.",
    },
  },
];

export const mockFinalReport = {
  overallScore: 81,
  grade: "B+",
  strongAreas: [
    "React Hooks & Internals",
    "CSS & Accessibility",
    "Testing Strategies",
  ],
  weakAreas: ["TypeScript Advanced Patterns", "System Design Depth"],
  questionSummary: [
    { id: 1, topic: "React & Hooks", score: 82, flagged: false },
    { id: 2, topic: "Performance Optimization", score: 75, flagged: true },
    { id: 3, topic: "TypeScript", score: 70, flagged: true },
    { id: 4, topic: "CSS & Accessibility", score: 88, flagged: false },
    { id: 5, topic: "System Design", score: 79, flagged: true },
    { id: 6, topic: "Testing Strategies", score: 85, flagged: false },
    { id: 7, topic: "React & Hooks", score: 91, flagged: false },
  ],
  recommendation:
    "You're well-prepared for this role! Focus on deepening your TypeScript type system knowledge and system design vocabulary before the real interview. Practice explaining CRDTs and advanced generic patterns out loud.",
} as const;
