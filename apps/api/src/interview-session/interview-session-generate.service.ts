import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { desc, eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { plainToInstance } from "class-transformer";
import { validate, type ValidationError } from "class-validator";
import type { GenerateInterviewSessionDto } from "./dto/generate-interview-session.dto";
import { InterviewBlueprintPayloadDto } from "./dto/interview-blueprint-payload.dto";
import {
  AI_INTERVIEW_GENERATOR_MODEL,
  AI_INTERVIEW_GENERATOR_SYSTEM_PROMPT,
  OPENAI_CHAT_COMPLETIONS_URL,
} from "./interview-session.constants";
import {
  buildInterviewTitle,
  buildSeedCategories,
  buildStubBlueprintQuestions,
  type ProfileSeedInput,
} from "./interview-session-seed.builder";
import type { InterviewBlueprintPreview } from "./interview-session.types";
import {
  interviewCandidateProfiles,
  interviewJobAnalyses,
  schema,
} from "../database/schema";
import {
  parseModelJsonObject,
  readOpenAiAssistantContent,
  readOpenAiErrorMessage,
} from "../problems/openai-completion.util";

type AppDb = NeonHttpDatabase<typeof schema>;

function flattenValidationErrors(
  errors: ValidationError[],
  parent = ""
): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};

  for (const error of errors) {
    const path = parent ? `${parent}.${error.property}` : error.property;

    if (error.constraints) {
      fieldErrors[path] = Object.values(error.constraints);
    }

    if (error.children?.length) {
      Object.assign(fieldErrors, flattenValidationErrors(error.children, path));
    }
  }

  return fieldErrors;
}

@Injectable()
export class InterviewSessionGenerateService {
  private readonly db: AppDb;

  constructor(@Inject("DRIZZLE") db: AppDb) {
    this.db = db;
  }

  async generatePreviewForUser(
    userId: string,
    input: GenerateInterviewSessionDto = {}
  ): Promise<InterviewBlueprintPreview> {
    const profile = input.profileId
      ? await this.getProfileById(userId, input.profileId)
      : await this.getLatestProfile(userId);
    const jobAnalysis = input.jobAnalysisId
      ? await this.getJobAnalysisById(userId, input.jobAnalysisId)
      : await this.getLatestJobAnalysis(userId);

    if (!profile) {
      throw new BadRequestException(
        "Save a candidate profile at /profile before generating an interview"
      );
    }
    if (!jobAnalysis) {
      throw new BadRequestException(
        "Save a job analysis at /job-analysis before generating an interview"
      );
    }

    const apiKey = process.env.OPENAI_API_KEY?.trim();
    const blueprint = apiKey
      ? await this.generateFromOpenAi(profile, jobAnalysis)
      : this.stubBlueprint(profile, jobAnalysis);

    return {
      profileId: profile.id,
      jobAnalysisId: jobAnalysis.id,
      companyName: jobAnalysis.companyName,
      roleTitle: jobAnalysis.roleTitle,
      roleSummary: jobAnalysis.roleSummary,
      questionCount: blueprint.questions.length,
      ...blueprint,
    };
  }

  private async generateFromOpenAi(
    profile: typeof interviewCandidateProfiles.$inferSelect,
    job: typeof interviewJobAnalyses.$inferSelect
  ): Promise<InterviewBlueprintPayloadDto> {
    const userContent = this.buildUserPrompt(profile, job);

    const upstream = await fetch(OPENAI_CHAT_COMPLETIONS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: AI_INTERVIEW_GENERATOR_MODEL,
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: AI_INTERVIEW_GENERATOR_SYSTEM_PROMPT },
          {
            role: "user",
            content: `${userContent}\n\nReturn only the JSON object.`,
          },
        ],
      }),
    });

    const rawText = await upstream.text();
    let completion: unknown;
    try {
      completion = JSON.parse(rawText) as unknown;
    } catch {
      throw new BadGatewayException({
        error: "OpenAI returned non-JSON.",
        detail: rawText.slice(0, 500),
      });
    }

    if (!upstream.ok) {
      throw new BadGatewayException({
        error: readOpenAiErrorMessage(completion, upstream.status),
      });
    }

    const content = readOpenAiAssistantContent(completion);
    if (!content?.trim()) {
      throw new BadGatewayException({
        error: "OpenAI returned an empty interview blueprint.",
      });
    }

    let parsedJson: unknown;
    try {
      parsedJson = parseModelJsonObject(content);
    } catch {
      throw new BadGatewayException({
        error: "OpenAI interview JSON could not be parsed.",
        detail: content.slice(0, 500),
      });
    }

    return this.validateBlueprint(parsedJson);
  }

  private buildUserPrompt(
    profile: typeof interviewCandidateProfiles.$inferSelect,
    job: typeof interviewJobAnalyses.$inferSelect
  ): string {
    return `Company: ${job.companyName}
Role: ${job.roleTitle}
Role summary: ${job.roleSummary}

Job analysis:
- Seniority: ${job.seniorityLevel.level} (${job.seniorityLevel.confidence} confidence)
- Required skills: ${job.requiredSkills.join("; ") || "(none listed)"}
- Nice-to-have: ${job.niceToHaveSkills.join("; ") || "(none listed)"}
- Interview categories: ${job.likelyInterviewCategories.join("; ") || "(none)"}
- Must prove: ${job.mustProve.join("; ") || "(none)"}
- Hidden expectations: ${job.hiddenExpectations.map((h) => `${h.expectation} (${h.reason})`).join("; ") || "(none)"}
- Interview signals: ${job.interviewSignals.join("; ") || "(none)"}

Candidate profile:
- Summary: ${profile.summary}
- Core skills: ${profile.coreSkills.join("; ") || "(none)"}
- Strength areas: ${profile.strengthAreas.join("; ") || "(none)"}
- Gap areas: ${profile.potentialGapAreas.join("; ") || "(none)"}
- Claims to verify: ${profile.claimsToVerify.map((c) => `${c.claim} → ${c.questionAngle}`).join("; ") || "(none)"}
- Projects: ${profile.projects.map((p) => `${p.name} (${p.role}): ${p.claims.join(", ")}`).join("; ") || "(none)"}`;
  }

  private stubBlueprint(
    profile: typeof interviewCandidateProfiles.$inferSelect,
    job: typeof interviewJobAnalyses.$inferSelect
  ): InterviewBlueprintPayloadDto {
    const profileInput: ProfileSeedInput = {
      summary: profile.summary,
      claimsToVerify: profile.claimsToVerify,
      projects: profile.projects,
    };
    const fixtures = buildStubBlueprintQuestions(profileInput, job);
    const interviewTitle = buildInterviewTitle(job.companyName, job.roleTitle);
    const categories = buildSeedCategories(job, fixtures);

    return plainToInstance(InterviewBlueprintPayloadDto, {
      interviewTitle: `${interviewTitle} (dev stub — set OPENAI_API_KEY for AI generation)`,
      estimatedDurationMinutes: Math.min(45, fixtures.length * 6),
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
  }

  private async validateBlueprint(
    parsedJson: unknown
  ): Promise<InterviewBlueprintPayloadDto> {
    const payload = plainToInstance(InterviewBlueprintPayloadDto, parsedJson);
    const validationErrors = await validate(payload, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (validationErrors.length > 0) {
      throw new UnprocessableEntityException({
        error: "Model JSON failed validation.",
        fields: flattenValidationErrors(validationErrors),
      });
    }

    return payload;
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

  private async getProfileById(userId: string, profileId: string) {
    const [row] = await this.db
      .select()
      .from(interviewCandidateProfiles)
      .where(eq(interviewCandidateProfiles.id, profileId))
      .limit(1);

    if (!row || row.userId !== userId) {
      throw new NotFoundException("Profile not found");
    }
    return row;
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

  private async getJobAnalysisById(userId: string, jobAnalysisId: string) {
    const [row] = await this.db
      .select()
      .from(interviewJobAnalyses)
      .where(eq(interviewJobAnalyses.id, jobAnalysisId))
      .limit(1);

    if (!row || row.userId !== userId) {
      throw new NotFoundException("Job analysis not found");
    }
    return row;
  }
}
