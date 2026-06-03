import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { InterviewBlueprintPayloadDto } from "./dto/interview-blueprint-payload.dto";
import {
  buildInterviewTitle,
  buildSeedCategories,
  buildStubBlueprintQuestions,
} from "./interview-session-seed.builder";

const profileFixture = {
  summary: "Senior frontend engineer with React and design systems experience.",
  claimsToVerify: [
    {
      claim: "Led micro frontend rollout",
      questionAngle: "Tell me about leading the micro frontend rollout",
    },
  ],
  projects: [
    {
      name: "IBM Design System",
      role: "Tech lead",
      claims: ["Scaled component library", "Accessibility standards"],
    },
  ],
};

const jobFixture = {
  companyName: "Acme Corp",
  roleTitle: "Senior Frontend Engineer",
  seniorityLevel: { level: "Senior" },
  likelyInterviewCategories: ["React", "Architecture", "Leadership"],
  requiredSkills: ["React", "TypeScript"],
  mustProve: ["Can design scalable UI architecture"],
  suggestedQuestionAngles: [
    { category: "React", angle: "How do you manage state in large React apps?" },
    {
      category: "Architecture",
      angle: "Explore experience with micro frontends",
    },
    {
      category: "Leadership",
      angle: "Tell me about mentoring engineers",
    },
  ],
};

describe("Interview Generator smoke", () => {
  it("stub builder produces at least 5 playable questions", () => {
    const questions = buildStubBlueprintQuestions(profileFixture, jobFixture);

    expect(questions.length).toBeGreaterThanOrEqual(5);
    expect(questions.length).toBeLessThanOrEqual(6);

    for (const q of questions) {
      expect(q.questionText.trim().length).toBeGreaterThanOrEqual(10);
      expect(q.expectedSignals.length).toBeGreaterThanOrEqual(2);
      expect(q.category.trim().length).toBeGreaterThan(0);
    }

    const orders = questions.map((q) => q.displayOrder);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it("stub blueprint payload passes DTO validation", async () => {
    const fixtures = buildStubBlueprintQuestions(profileFixture, jobFixture);
    const interviewTitle = buildInterviewTitle(
      jobFixture.companyName,
      jobFixture.roleTitle
    );
    const categories = buildSeedCategories(jobFixture, fixtures);

    const payload = plainToInstance(InterviewBlueprintPayloadDto, {
      interviewTitle,
      estimatedDurationMinutes: 30,
      categories,
      questions: fixtures.map((f) => ({
        order: f.displayOrder,
        category: f.category,
        difficulty: f.difficulty,
        question: f.questionText,
        expectedSignals: f.expectedSignals,
        followUpOpportunities: f.followUpOpportunities,
      })),
    });

    const errors = await validate(payload, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    expect(errors).toHaveLength(0);
    expect(payload.questions.length).toBeGreaterThanOrEqual(5);
  });
});
