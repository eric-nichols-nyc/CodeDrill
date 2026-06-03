import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { desc, eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import type { JobAnalysisPayloadDto } from "./dto/job-analysis-payload.dto";
import { interviewJobAnalyses, schema } from "../database/schema";

export type JobAnalysisView = JobAnalysisPayloadDto & {
  id: string;
  jobDescription: string;
  jobUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

type AppDb = NeonHttpDatabase<typeof schema>;

@Injectable()
export class InterviewJobAnalysisService {
  private readonly db: AppDb;

  constructor(@Inject("DRIZZLE") db: AppDb) {
    this.db = db;
  }

  async getLatestForUser(userId: string): Promise<JobAnalysisView | null> {
    const [row] = await this.db
      .select()
      .from(interviewJobAnalyses)
      .where(eq(interviewJobAnalyses.userId, userId))
      .orderBy(desc(interviewJobAnalyses.createdAt))
      .limit(1);

    return row ? this.toView(row) : null;
  }

  async getByIdForUser(
    userId: string,
    jobAnalysisId: string
  ): Promise<JobAnalysisView> {
    const row = await this.requireOwnedAnalysis(userId, jobAnalysisId);
    return this.toView(row);
  }

  async saveForUser(
    userId: string,
    jobDescription: string,
    jobUrl: string | undefined,
    payload: JobAnalysisPayloadDto
  ): Promise<JobAnalysisView> {
    const now = new Date();
    const trimmedDescription = jobDescription.trim();
    const trimmedUrl = jobUrl?.trim() || null;

    const [row] = await this.db
      .insert(interviewJobAnalyses)
      .values({
        userId,
        sourceText: trimmedDescription,
        sourceUrl: trimmedUrl,
        companyName: payload.companyName.trim(),
        roleTitle: payload.roleTitle.trim(),
        roleSummary: payload.roleSummary,
        requiredSkills: payload.requiredSkills,
        niceToHaveSkills: payload.niceToHaveSkills,
        seniorityLevel: payload.seniorityLevel,
        likelyInterviewCategories: payload.likelyInterviewCategories,
        mustProve: payload.mustProve,
        hiddenExpectations: payload.hiddenExpectations,
        interviewSignals: payload.interviewSignals,
        suggestedQuestionAngles: payload.suggestedQuestionAngles,
        updatedAt: now,
      })
      .returning();

    if (!row) {
      throw new NotFoundException("Failed to save job analysis");
    }

    return this.toView(row);
  }

  private async requireOwnedAnalysis(userId: string, jobAnalysisId: string) {
    const [row] = await this.db
      .select()
      .from(interviewJobAnalyses)
      .where(eq(interviewJobAnalyses.id, jobAnalysisId))
      .limit(1);

    if (!row) {
      throw new NotFoundException(`Job analysis ${jobAnalysisId} not found`);
    }

    if (row.userId !== userId) {
      throw new ForbiddenException("Job analysis does not belong to this user");
    }

    return row;
  }

  private toView(
    row: typeof interviewJobAnalyses.$inferSelect
  ): JobAnalysisView {
    return {
      id: row.id,
      jobDescription: row.sourceText,
      jobUrl: row.sourceUrl,
      companyName: row.companyName,
      roleTitle: row.roleTitle,
      roleSummary: row.roleSummary,
      requiredSkills: row.requiredSkills,
      niceToHaveSkills: row.niceToHaveSkills,
      seniorityLevel: row.seniorityLevel,
      likelyInterviewCategories: row.likelyInterviewCategories,
      mustProve: row.mustProve,
      hiddenExpectations: row.hiddenExpectations,
      interviewSignals: row.interviewSignals,
      suggestedQuestionAngles: row.suggestedQuestionAngles,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
