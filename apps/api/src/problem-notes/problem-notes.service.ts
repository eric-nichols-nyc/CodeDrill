import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { and, eq, isNotNull } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import {
  problemLearningNotes,
  problems,
  schema,
} from "../database/schema";
import type { UpsertProblemNoteDto } from "./dto/upsert-problem-note.dto";

export type ProblemPersonalNoteView = {
  body: string;
  updatedAt: string | null;
};

const PERSONAL_NOTE_TYPE = "other";

type AppDb = NeonHttpDatabase<typeof schema>;

@Injectable()
export class ProblemNotesService {
  private readonly db: AppDb;

  constructor(@Inject("DRIZZLE") db: AppDb) {
    this.db = db;
  }

  async getForUser(
    userId: string,
    problemId: string
  ): Promise<ProblemPersonalNoteView> {
    await this.assertProblemExists(problemId);

    const [row] = await this.db
      .select({
        body: problemLearningNotes.body,
        updatedAt: problemLearningNotes.updatedAt,
      })
      .from(problemLearningNotes)
      .where(
        and(
          eq(problemLearningNotes.userId, userId),
          eq(problemLearningNotes.problemId, problemId),
          isNotNull(problemLearningNotes.userId)
        )
      )
      .limit(1);

    if (!row) {
      return { body: "", updatedAt: null };
    }

    return {
      body: row.body,
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  async upsertForUser(
    userId: string,
    problemId: string,
    dto: UpsertProblemNoteDto
  ): Promise<ProblemPersonalNoteView> {
    await this.assertProblemExists(problemId);

    const now = new Date();
    const [row] = await this.db
      .insert(problemLearningNotes)
      .values({
        userId,
        problemId,
        noteType: PERSONAL_NOTE_TYPE,
        body: dto.body,
        sortOrder: 0,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [problemLearningNotes.userId, problemLearningNotes.problemId],
        set: {
          body: dto.body,
          updatedAt: now,
        },
      })
      .returning({
        body: problemLearningNotes.body,
        updatedAt: problemLearningNotes.updatedAt,
      });

    if (!row) {
      throw new NotFoundException("Failed to save problem note");
    }

    return {
      body: row.body,
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  private async assertProblemExists(problemId: string): Promise<void> {
    const [found] = await this.db
      .select({ id: problems.id })
      .from(problems)
      .where(eq(problems.id, problemId))
      .limit(1);

    if (!found) {
      throw new NotFoundException(`Problem ${problemId} not found`);
    }
  }
}
