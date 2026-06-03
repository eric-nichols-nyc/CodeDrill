import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { desc, eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import type { ProfilePayloadDto } from "./dto/profile-payload.dto";
import {
  interviewCandidateProfiles,
  interviewResumes,
  schema,
} from "../database/schema";

export type CandidateProfileView = {
  id: string;
  resumeId: string;
  summary: string;
  coreSkills: string[];
  projects: ProfilePayloadDto["projects"];
  claimsToVerify: ProfilePayloadDto["claimsToVerify"];
  strengthAreas: string[];
  potentialGapAreas: string[];
  createdAt: string;
  updatedAt: string;
};

type AppDb = NeonHttpDatabase<typeof schema>;

@Injectable()
export class InterviewProfileService {
  private readonly db: AppDb;

  constructor(@Inject("DRIZZLE") db: AppDb) {
    this.db = db;
  }

  async getLatestForUser(userId: string): Promise<CandidateProfileView | null> {
    const [row] = await this.db
      .select()
      .from(interviewCandidateProfiles)
      .where(eq(interviewCandidateProfiles.userId, userId))
      .orderBy(desc(interviewCandidateProfiles.updatedAt))
      .limit(1);

    return row ? this.toView(row) : null;
  }

  async getByIdForUser(
    userId: string,
    profileId: string
  ): Promise<CandidateProfileView> {
    const profile = await this.requireOwnedProfile(userId, profileId);
    return this.toView(profile);
  }

  async saveForUser(
    userId: string,
    resumeText: string,
    payload: ProfilePayloadDto
  ): Promise<CandidateProfileView> {
    const now = new Date();
    const trimmedResume = resumeText.trim();

    const [resume] = await this.db
      .insert(interviewResumes)
      .values({
        userId,
        extractedText: trimmedResume,
        updatedAt: now,
      })
      .returning({ id: interviewResumes.id });

    if (!resume) {
      throw new NotFoundException("Failed to save resume input");
    }

    const [profile] = await this.db
      .insert(interviewCandidateProfiles)
      .values({
        userId,
        resumeId: resume.id,
        summary: payload.summary,
        coreSkills: payload.coreSkills,
        projects: payload.projects,
        claimsToVerify: payload.claimsToVerify,
        strengthAreas: payload.strengthAreas,
        potentialGapAreas: payload.potentialGapAreas,
        updatedAt: now,
      })
      .returning();

    if (!profile) {
      throw new NotFoundException("Failed to save candidate profile");
    }

    return this.toView(profile);
  }

  async updateForUser(
    userId: string,
    profileId: string,
    payload: ProfilePayloadDto
  ): Promise<CandidateProfileView> {
    await this.requireOwnedProfile(userId, profileId);

    const now = new Date();
    const [updated] = await this.db
      .update(interviewCandidateProfiles)
      .set({
        summary: payload.summary,
        coreSkills: payload.coreSkills,
        projects: payload.projects,
        claimsToVerify: payload.claimsToVerify,
        strengthAreas: payload.strengthAreas,
        potentialGapAreas: payload.potentialGapAreas,
        updatedAt: now,
      })
      .where(eq(interviewCandidateProfiles.id, profileId))
      .returning();

    if (!updated) {
      throw new NotFoundException("Failed to update candidate profile");
    }

    return this.toView(updated);
  }

  private async requireOwnedProfile(userId: string, profileId: string) {
    const [row] = await this.db
      .select()
      .from(interviewCandidateProfiles)
      .where(eq(interviewCandidateProfiles.id, profileId))
      .limit(1);

    if (!row) {
      throw new NotFoundException(`Profile ${profileId} not found`);
    }

    if (row.userId !== userId) {
      throw new ForbiddenException("Profile does not belong to this user");
    }

    return row;
  }

  private toView(
    row: typeof interviewCandidateProfiles.$inferSelect
  ): CandidateProfileView {
    return {
      id: row.id,
      resumeId: row.resumeId,
      summary: row.summary,
      coreSkills: row.coreSkills,
      projects: row.projects,
      claimsToVerify: row.claimsToVerify,
      strengthAreas: row.strengthAreas,
      potentialGapAreas: row.potentialGapAreas,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
