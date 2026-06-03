import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { asc, eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import type { SubmitAnswerDto } from "./dto/submit-answer.dto";
import type {
  InterviewQuestionView,
  InterviewSessionView,
  QuestionAnswerView,
} from "./interview-session.types";
import {
  interviewCandidateProfiles,
  interviewJobAnalyses,
  interviewQuestions,
  interviewSessions,
  schema,
} from "../database/schema";

type AppDb = NeonHttpDatabase<typeof schema>;

const MIN_TRANSCRIPT_LENGTH = 10;

@Injectable()
export class InterviewSessionService {
  private readonly db: AppDb;

  constructor(@Inject("DRIZZLE") db: AppDb) {
    this.db = db;
  }

  async getByIdForUser(
    userId: string,
    interviewId: string
  ): Promise<InterviewSessionView> {
    const session = await this.requireOwnedSession(userId, interviewId);
    const questions = await this.loadQuestions(interviewId);
    return await this.toSessionView(session, questions);
  }

  async startForUser(
    userId: string,
    interviewId: string
  ): Promise<InterviewSessionView> {
    const session = await this.requireOwnedSession(userId, interviewId);

    if (session.status === "ready") {
      const now = new Date();
      const [updated] = await this.db
        .update(interviewSessions)
        .set({
          status: "in_progress",
          startedAt: now,
          updatedAt: now,
        })
        .where(eq(interviewSessions.id, interviewId))
        .returning();

      if (!updated) {
        throw new NotFoundException(`Interview session ${interviewId} not found`);
      }

      const questions = await this.loadQuestions(interviewId);
      return await this.toSessionView(updated, questions);
    }

    const questions = await this.loadQuestions(interviewId);
    return await this.toSessionView(session, questions);
  }

  async submitAnswerForUser(
    userId: string,
    interviewId: string,
    questionId: string,
    body: SubmitAnswerDto
  ): Promise<InterviewSessionView> {
    const session = await this.requireOwnedSession(userId, interviewId);

    if (session.status === "completed") {
      throw new BadRequestException("Interview is already completed");
    }

    const transcript = body.transcript.trim();
    if (transcript.length < MIN_TRANSCRIPT_LENGTH) {
      throw new BadRequestException(
        `Answer must be at least ${MIN_TRANSCRIPT_LENGTH} characters`
      );
    }

    const question = await this.requireOwnedQuestion(
      userId,
      interviewId,
      questionId
    );

    const now = new Date();
    const [updatedQuestion] = await this.db
      .update(interviewQuestions)
      .set({
        answerMode: body.answerMode,
        transcript,
        durationSeconds: body.durationSeconds ?? null,
        submittedAt: now,
      })
      .where(eq(interviewQuestions.id, question.id))
      .returning();

    if (!updatedQuestion) {
      throw new NotFoundException(`Question ${questionId} not found`);
    }

    if (session.status === "ready") {
      await this.db
        .update(interviewSessions)
        .set({
          status: "in_progress",
          startedAt: now,
          updatedAt: now,
        })
        .where(eq(interviewSessions.id, interviewId));
    } else {
      await this.db
        .update(interviewSessions)
        .set({ updatedAt: now })
        .where(eq(interviewSessions.id, interviewId));
    }

    const refreshedSession = await this.requireOwnedSession(userId, interviewId);
    const questions = await this.loadQuestions(interviewId);
    return await this.toSessionView(refreshedSession, questions);
  }

  async completeForUser(
    userId: string,
    interviewId: string
  ): Promise<InterviewSessionView> {
    const session = await this.requireOwnedSession(userId, interviewId);
    const questions = await this.loadQuestions(interviewId);

    const unanswered = questions.filter((q) => !q.submittedAt);
    if (unanswered.length > 0) {
      throw new BadRequestException(
        "All questions must be answered before completing the interview"
      );
    }

    const now = new Date();
    const [updated] = await this.db
      .update(interviewSessions)
      .set({
        status: "completed",
        completedAt: now,
        updatedAt: now,
      })
      .where(eq(interviewSessions.id, interviewId))
      .returning();

    if (!updated) {
      throw new NotFoundException(`Interview session ${interviewId} not found`);
    }

    return await this.toSessionView(updated, questions);
  }

  private async loadQuestions(sessionId: string) {
    return this.db
      .select()
      .from(interviewQuestions)
      .where(eq(interviewQuestions.sessionId, sessionId))
      .orderBy(asc(interviewQuestions.displayOrder));
  }

  private async requireOwnedSession(userId: string, interviewId: string) {
    const [session] = await this.db
      .select()
      .from(interviewSessions)
      .where(eq(interviewSessions.id, interviewId))
      .limit(1);

    if (!session) {
      throw new NotFoundException(`Interview session ${interviewId} not found`);
    }

    if (session.userId !== userId) {
      throw new ForbiddenException("Interview session does not belong to this user");
    }

    return session;
  }

  private async requireOwnedQuestion(
    userId: string,
    interviewId: string,
    questionId: string
  ) {
    const [question] = await this.db
      .select()
      .from(interviewQuestions)
      .where(eq(interviewQuestions.id, questionId))
      .limit(1);

    if (!question || question.sessionId !== interviewId) {
      throw new NotFoundException(`Question ${questionId} not found`);
    }

    await this.requireOwnedSession(userId, interviewId);
    return question;
  }

  private async toSessionView(
    session: typeof interviewSessions.$inferSelect,
    questions: (typeof interviewQuestions.$inferSelect)[]
  ): Promise<InterviewSessionView> {
    const [job] = await this.db
      .select({
        companyName: interviewJobAnalyses.companyName,
        roleTitle: interviewJobAnalyses.roleTitle,
        roleSummary: interviewJobAnalyses.roleSummary,
      })
      .from(interviewJobAnalyses)
      .where(eq(interviewJobAnalyses.id, session.jobAnalysisId))
      .limit(1);

    const jobContext = {
      companyName: job?.companyName ?? "",
      roleTitle: job?.roleTitle ?? "",
      roleSummary: job?.roleSummary ?? "",
    };

    return {
      id: session.id,
      interviewTitle: session.interviewTitle,
      estimatedDurationMinutes: session.estimatedDurationMinutes,
      questionCount: session.questionCount,
      categories: session.categories,
      status: session.status,
      startedAt: session.startedAt?.toISOString() ?? null,
      completedAt: session.completedAt?.toISOString() ?? null,
      profileId: session.profileId,
      jobAnalysisId: session.jobAnalysisId,
      jobContext,
      questions: questions.map((q) => this.toQuestionView(q)),
    };
  }

  private toQuestionView(
    row: typeof interviewQuestions.$inferSelect
  ): InterviewQuestionView {
    let answer: QuestionAnswerView | null = null;
    if (
      row.submittedAt &&
      row.transcript &&
      row.answerMode &&
      (row.answerMode === "voice" || row.answerMode === "text")
    ) {
      answer = {
        answerMode: row.answerMode,
        transcript: row.transcript,
        durationSeconds: row.durationSeconds,
        submittedAt: row.submittedAt.toISOString(),
      };
    }

    return {
      id: row.id,
      order: row.displayOrder,
      category: row.category,
      difficulty: row.difficulty,
      question: row.questionText,
      expectedSignals: row.expectedSignals,
      answer,
    };
  }
}
