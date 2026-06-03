import {
  BadRequestException,
  Inject,
  Injectable,
} from "@nestjs/common";
import { desc, eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import {
  buildInterviewTitle,
  buildQuestionsFromJobAnalysis,
  buildSeedCategories,
} from "./interview-session-seed.builder";
import { SEED_ESTIMATED_DURATION_MINUTES } from "./interview-session-seed.constants";
// biome-ignore lint/style/useImportType: Nest uses emitted constructor param metadata
import { InterviewSessionPersistService } from "./interview-session-persist.service";
import type { SeedSessionResult } from "./interview-session.types";
import {
  interviewCandidateProfiles,
  interviewJobAnalyses,
  schema,
} from "../database/schema";

type AppDb = NeonHttpDatabase<typeof schema>;

@Injectable()
export class InterviewSessionSeedService {
  private readonly db: AppDb;
  private readonly persistService: InterviewSessionPersistService;

  constructor(
    @Inject("DRIZZLE") db: AppDb,
    persistService: InterviewSessionPersistService
  ) {
    this.db = db;
    this.persistService = persistService;
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

    return this.persistService.createFromFixtures({
      userId,
      profileId: profile.id,
      jobAnalysisId: jobAnalysis.id,
      interviewTitle,
      estimatedDurationMinutes: SEED_ESTIMATED_DURATION_MINUTES,
      categories,
      questions,
    });
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
