import { angleToInterviewQuestion } from "./interview-session-seed.builder";

describe("angleToInterviewQuestion", () => {
  it("rewrites Explore experience with… probes", () => {
    expect(
      angleToInterviewQuestion(
        "Explore experience with React.js and state management solutions",
        "React"
      )
    ).toBe(
      "Can you walk me through your experience with React.js and state management solutions?"
    );
  });

  it("preserves natural How/Tell me questions", () => {
    expect(
      angleToInterviewQuestion(
        "How would you share authentication across independently deployed applications?",
        "Micro Frontends"
      )
    ).toBe(
      "How would you share authentication across independently deployed applications?"
    );
  });

  it("rewrites Ask about… interviewer notes", () => {
    expect(
      angleToInterviewQuestion("Ask about token refresh strategy", "Security")
    ).toBe("Tell me about token refresh strategy.");
  });
});
