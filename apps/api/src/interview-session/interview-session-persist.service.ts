import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import type { InterviewBlueprintPayloadDto } from "./dto/interview-blueprint-payload.dto";
import type { SeedSessionResult } from "./interview-session.types";
import type { SeedQuestionFixture } from "./interview-session-seed.constants";
import {
  interviewCandidateProfiles,
  interviewJobAnalyses,
  interviewQuestions,
  interviewSessions,
  schema,
} from "../database/schema";

type AppDb = NeonHttpDatabase<typeof schema>;

type PersistInput = {
  userId: string;
  profileId: string;
  jobAnalysisId: string;
  interviewTitle: string;
  estimatedDurationMinutes: number;
  categories: string[];
  questions: SeedQuestionFixture[];
};

@Injectable()
export class InterviewSessionPersistService {
  private readonly db: AppDb;

  constructor(@Inject("DRIZZLE") db: AppDb) {
    this.db = db;
  }

  async createFromBlueprint(
    userId: string,
    profileId: string,
    jobAnalysisId: string,
    blueprint: InterviewBlueprintPayloadDto
  ): Promise<SeedSessionResult> {
    await this.assertProfileOwned(userId, profileId);
    const job = await this.assertJobAnalysisOwned(userId, jobAnalysisId);

    const questions = this.blueprintToFixtures(blueprint);
    if (questions.length < 5) {
      throw new BadRequestException(
        "Interview must include at least 5 questions"
      );
    }

    const now = new Date();
    const [session] = await this.db
      .insert(interviewSessions)
      .values({
        userId,
        profileId,
        jobAnalysisId,
        interviewTitle: blueprint.interviewTitle.trim(),
        estimatedDurationMinutes: blueprint.estimatedDurationMinutes,
        questionCount: questions.length,
        categories: blueprint.categories,
        status: "ready",
        generatedAt: now,
        updatedAt: now,
      })
      .returning({ id: interviewSessions.id });

    if (!session) {
      throw new NotFoundException("Failed to create interview session");
    }

    await this.db.insert(interviewQuestions).values(
      questions.map((fixture) => ({
        sessionId: session.id,
        displayOrder: fixture.displayOrder,
        category: fixture.category,
        difficulty: fixture.difficulty,
        questionText: fixture.questionText,
        expectedSignals: fixture.expectedSignals,
        followUpOpportunities: fixture.followUpOpportunities,
      }))
    );

    return {
      interviewId: session.id,
      interviewTitle: blueprint.interviewTitle.trim(),
      companyName: job.companyName,
      roleTitle: job.roleTitle,
    };
  }

  async createFromFixtures(input: PersistInput): Promise<SeedSessionResult> {
    await this.assertProfileOwned(input.userId, input.profileId);
    const job = await this.assertJobAnalysisOwned(
      input.userId,
      input.jobAnalysisId
    );

    const now = new Date();
    const [session] = await this.db
      .insert(interviewSessions)
      .values({
        userId: input.userId,
        profileId: input.profileId,
        jobAnalysisId: input.jobAnalysisId,
        interviewTitle: input.interviewTitle,
        estimatedDurationMinutes: input.estimatedDurationMinutes,
        questionCount: input.questions.length,
        categories: input.categories,
        status: "ready",
        generatedAt: now,
        updatedAt: now,
      })
      .returning({ id: interviewSessions.id });

    if (!session) {
      throw new NotFoundException("Failed to create interview session");
    }

    await this.db.insert(interviewQuestions).values(
      input.questions.map((fixture) => ({
        sessionId: session.id,
        displayOrder: fixture.displayOrder,
        category: fixture.category,
        difficulty: fixture.difficulty,
        questionText: fixture.questionText,
        expectedSignals: fixture.expectedSignals,
        followUpOpportunities: fixture.followUpOpportunities,
      }))
    );

    return {
      interviewId: session.id,
      interviewTitle: input.interviewTitle,
      companyName: job.companyName,
      roleTitle: job.roleTitle,
    };
  }

  private blueprintToFixtures(
    blueprint: InterviewBlueprintPayloadDto
  ): SeedQuestionFixture[] {
    const sorted = [...blueprint.questions].sort((a, b) => a.order - b.order);
    return sorted.map((q, index) => ({
      displayOrder: index + 1,
      category: q.category.trim(),
      difficulty: q.difficulty.trim(),
      questionText: q.question.trim(),
      expectedSignals: q.expectedSignals,
      followUpOpportunities: q.followUpOpportunities ?? [],
    }));
  }

  private async assertProfileOwned(userId: string, profileId: string) {
    const [row] = await this.db
      .select({ id: interviewCandidateProfiles.id, userId: interviewCandidateProfiles.userId })
      .from(interviewCandidateProfiles)
      .where(eq(interviewCandidateProfiles.id, profileId))
      .limit(1);

    if (!row) {
      throw new NotFoundException("Profile not found");
    }
    if (row.userId !== userId) {
      throw new ForbiddenException("Profile not found");
    }
  }

  private async assertJobAnalysisOwned(userId: string, jobAnalysisId: string) {
    const [row] = await this.db
      .select()
      .from(interviewJobAnalyses)
      .where(eq(interviewJobAnalyses.id, jobAnalysisId))
      .limit(1);

    if (!row) {
      throw new NotFoundException("Job analysis not found");
    }
    if (row.userId !== userId) {
      throw new ForbiddenException("Job analysis not found");
    }
    return row;
  }
}
