export type MockQuestion = {
  id: number;
  text: string;
  topic: string;
};

export type MockFeedback = {
  score: number;
  maxScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestedAnswer: string;
  studyTopics: string[];
};

export const mockInterview = {
  company: "Acme Corp",
  role: "Senior Frontend Engineer",
  topics: ["React", "System design", "Performance", "Leadership"],
  questionCount: 5,
  estimatedMinutes: 35,
  difficulty: "Mid-level",
} as const;

export const mockQuestions: MockQuestion[] = [
  {
    id: 1,
    topic: "Experience",
    text: "Tell me about a time you improved frontend performance on a production app. What did you measure and what changed?",
  },
  {
    id: 2,
    topic: "React",
    text: "How do you decide between server components, client components, and shared state in a Next.js app?",
  },
  {
    id: 3,
    topic: "System design",
    text: "Design a real-time collaborative document editor. What are the main architectural tradeoffs?",
  },
  {
    id: 4,
    topic: "Leadership",
    text: "Describe a situation where you disagreed with a technical direction. How did you handle it?",
  },
  {
    id: 5,
    topic: "Depth",
    text: "Walk me through how the browser renders a page from URL to pixels on screen.",
  },
];

export const mockFeedbackByQuestion: MockFeedback[] = [
  {
    score: 7,
    maxScore: 10,
    strengths: ["Clear STAR structure", "Mentioned Core Web Vitals"],
    weaknesses: ["Light on before/after metrics", "Missed caching tradeoffs"],
    suggestedAnswer:
      "Lead with the baseline metric, the bottleneck you found, the change you shipped, and the measured outcome.",
    studyTopics: ["Rendering pipeline", "Cache strategies"],
  },
  {
    score: 8,
    maxScore: 10,
    strengths: ["Good boundary between server and client", "Mentioned data fetching"],
    weaknesses: ["Could compare to alternative patterns more explicitly"],
    suggestedAnswer:
      "Default to server components; push interactivity to the smallest client islands; colocate data fetching at the route boundary.",
    studyTopics: ["React Server Components", "Next.js App Router"],
  },
  {
    score: 6,
    maxScore: 10,
    strengths: ["Identified WebSockets and CRDTs"],
    weaknesses: ["Skipped conflict resolution", "No mention of offline or scale"],
    suggestedAnswer:
      "Cover transport, persistence, conflict model, presence, and how you would validate latency at scale.",
    studyTopics: ["CRDTs", "Operational transformation", "WebSocket scaling"],
  },
  {
    score: 7,
    maxScore: 10,
    strengths: ["Showed empathy and alignment focus"],
    weaknesses: ["Outcome was vague", "Missing how you documented the decision"],
    suggestedAnswer:
      "Explain the disagreement, data you gathered, who you aligned with, and the result for the team.",
    studyTopics: ["Stakeholder communication", "RFC / ADR practices"],
  },
  {
    score: 5,
    maxScore: 10,
    strengths: ["Named HTML parsing and layout"],
    weaknesses: ["Skipped compositing and paint", "No connection to performance work"],
    suggestedAnswer:
      "Walk through navigation, HTML/CSS/JS loading, parse, style, layout, paint, composite, and where bottlenecks appear.",
    studyTopics: ["Critical rendering path", "Browser devtools performance panel"],
  },
];

export const mockFinalReport = {
  overallScore: 72,
  strongAreas: ["React patterns", "Collaboration stories", "Structured answers"],
  weakAreas: ["System design depth", "Browser internals", "Quantified impact"],
  redFlags: ["One answer lacked measurable outcomes"],
  questionsToRevisit: [3, 5],
  studyRecommendations: [
    "Browser rendering pipeline",
    "Caching and CDN strategies",
    "Collaborative system design patterns",
  ],
} as const;
