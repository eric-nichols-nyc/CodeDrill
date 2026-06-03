import type { PlayerSessionPreview } from "@/features/interview-player/types";

/** Gate 1 demo — replaced by API session load in Gate 2. */
export function getGate1DemoSession(interviewId: string): PlayerSessionPreview {
  return {
    interviewId,
    interviewTitle: "Senior Frontend Engineer Interview (demo)",
    questionCount: 1,
    questions: [
      {
        id: "gate1-q1",
        order: 1,
        category: "React & Hooks",
        difficulty: "Senior",
        question:
          "Can you explain the difference between `useEffect` and `useLayoutEffect`, and describe a scenario where you'd choose one over the other?",
        expectedSignals: [
          "timing difference between useEffect and useLayoutEffect",
          "useLayoutEffect runs before browser paint",
          "concrete scenario such as measuring DOM or preventing flicker",
          "when useEffect is the better default",
        ],
      },
    ],
  };
}
