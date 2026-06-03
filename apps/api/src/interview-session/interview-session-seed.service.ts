import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { desc, eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import {
  buildInterviewTitle,
  buildQuestionsFromJobAnalysis,
  buildSeedCategories,
} from "./interview-session-seed.builder";
import { SEED_ESTIMATED_DURATION_MINUTES } from "./interview-session-seed.constants";
import type { SeedSessionResult } from "./interview-session.types";
import {
  interviewCandidateProfiles,
  interviewJobAnalyses,
  interviewQuestions,
  interviewSessions,
  schema,
} from "../database/schema";

type AppDb = NeonHttpDatabase<typeof schema>;

@Injectable()
export class InterviewSessionSeedService {
  private readonly db: AppDb;

  constructor(@Inject("DRIZZLE") db: AppDb) {
    this.db = db;
  }

  async seedDemoSessionForUser(userId: string): Promise<SeedSessionResult> {
    const profile = await this.getLatestProfile(userId);
    const jobAnalysis = await this.getLatestJobAnalysis(userId);

    if (!profile) {
      throw new BadRequestException(
        "Save a candidate profile at /profile before creating an interview"
      );
    }

    if (!jobAnalysis) {
      throw new BadRequestException(
        "Save a job analysis at /job-analysis before creating an interview (Generate, then Save)"
      );
    }

    const questions = buildQuestionsFromJobAnalysis(jobAnalysis);
    const interviewTitle = buildInterviewTitle(
      jobAnalysis.companyName,
      jobAnalysis.roleTitle
    );
    const categories = buildSeedCategories(jobAnalysis, questions);
    const now = new Date();

    const [session] = await this.db
      .insert(interviewSessions)
      .values({
        userId,
        profileId: profile.id,
        jobAnalysisId: jobAnalysis.id,
        interviewTitle,
        estimatedDurationMinutes: SEED_ESTIMATED_DURATION_MINUTES,
        questionCount: questions.length,
        categories,
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
      interviewTitle,
      companyName: jobAnalysis.companyName,
      roleTitle: jobAnalysis.roleTitle,
    };
  }

  private async getLatestProfile(userId: string) {
    const [row] = await this.db
      .select()
      .from(interviewCandidateProfiles)
      .where(eq(interviewCandidateProfiles.userId, userId))
      .orderBy(desc(interviewCandidateProfiles.updatedAt))
      .limit(1);

    return row ?? null;
  }

  private async getLatestJobAnalysis(userId: string) {
    const [row] = await this.db
      .select()
      .from(interviewJobAnalyses)
      .where(eq(interviewJobAnalyses.userId, userId))
      .orderBy(desc(interviewJobAnalyses.createdAt))
      .limit(1);

    return row ?? null;
  }
}
