import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { and, asc, eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { problems, problemWorkspaceCode, schema } from "../database/schema";
import type { UpsertWorkspaceCodeDto } from "./dto/upsert-workspace-code.dto";

export type WorkspaceCodeEntry = {
  language: string;
  code: string;
  updatedAt: string;
};

type AppDb = NeonHttpDatabase<typeof schema>;

@Injectable()
export class ProblemWorkspaceCodeService {
  private readonly db: AppDb;

  constructor(@Inject("DRIZZLE") db: AppDb) {
    this.db = db;
  }

  async listForUser(
    userId: string,
    problemId: string
  ): Promise<WorkspaceCodeEntry[]> {
    await this.assertProblemExists(problemId);

    const rows = await this.db
      .select({
        language: problemWorkspaceCode.language,
        code: problemWorkspaceCode.code,
        updatedAt: problemWorkspaceCode.updatedAt,
      })
      .from(problemWorkspaceCode)
      .where(
        and(
          eq(problemWorkspaceCode.userId, userId),
          eq(problemWorkspaceCode.problemId, problemId)
        )
      )
      .orderBy(asc(problemWorkspaceCode.language));

    return rows.map((row) => ({
      language: row.language,
      code: row.code,
      updatedAt: row.updatedAt.toISOString(),
    }));
  }

  async upsertForUser(
    userId: string,
    problemId: string,
    dto: UpsertWorkspaceCodeDto
  ): Promise<WorkspaceCodeEntry> {
    await this.assertProblemExists(problemId);

    const now = new Date();
    const [row] = await this.db
      .insert(problemWorkspaceCode)
      .values({
        userId,
        problemId,
        language: dto.language,
        code: dto.code,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [
          problemWorkspaceCode.userId,
          problemWorkspaceCode.problemId,
          problemWorkspaceCode.language,
        ],
        set: {
          code: dto.code,
          updatedAt: now,
        },
      })
      .returning({
        language: problemWorkspaceCode.language,
        code: problemWorkspaceCode.code,
        updatedAt: problemWorkspaceCode.updatedAt,
      });

    if (!row) {
      throw new NotFoundException("Failed to save workspace code");
    }

    return {
      language: row.language,
      code: row.code,
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
