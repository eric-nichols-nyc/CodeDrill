import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { problems, problemProgress, schema } from "../database/schema";
import type { PatchProblemProgressDto } from "./dto/patch-problem-progress.dto";

/** What the client sees — not every DB column (e.g. no submission ids yet). */
export type ProblemProgressView = {
  status: "not_started" | "attempted" | "solved";
  isFavorite: boolean;
  updatedAt: string;
};

const DEFAULT_PROGRESS: Omit<ProblemProgressView, "updatedAt"> = {
  status: "not_started",
  isFavorite: false,
};

type AppDb = NeonHttpDatabase<typeof schema>;

@Injectable()
export class ProblemProgressService {
  private readonly db: AppDb;

  constructor(@Inject("DRIZZLE") db: AppDb) {
    this.db = db;
  }

  /**
   * Read progress for this user + problem.
   * No row yet → return defaults (user hasn't interacted; not an error).
   */
  async getForUser(
    userId: string,
    problemId: string
  ): Promise<ProblemProgressView> {
    await this.assertProblemExists(problemId);

    const [row] = await this.db
      .select({
        status: problemProgress.status,
        isFavorite: problemProgress.isFavorite,
        updatedAt: problemProgress.updatedAt,
      })
      .from(problemProgress)
      .where(
        and(
          eq(problemProgress.userId, userId),
          eq(problemProgress.problemId, problemId)
        )
      )
      .limit(1);

    if (!row) {
      return {
        ...DEFAULT_PROGRESS,
        updatedAt: new Date(0).toISOString(),
      };
    }

    return {
      status: row.status as ProblemProgressView["status"],
      isFavorite: row.isFavorite,
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  /**
   * Partial update: only fields present on `dto` are written.
   * Uses upsert so the first favorite-toggle creates the row.
   */
  async patchForUser(
    userId: string,
    problemId: string,
    dto: PatchProblemProgressDto
  ): Promise<ProblemProgressView> {
    await this.assertProblemExists(problemId);

    const now = new Date();
    const insertValues = {
      userId,
      problemId,
      status: dto.status ?? DEFAULT_PROGRESS.status,
      isFavorite: dto.isFavorite ?? DEFAULT_PROGRESS.isFavorite,
      updatedAt: now,
    };

    const updateSet: Partial<typeof insertValues> = { updatedAt: now };
    if (dto.status !== undefined) {
      updateSet.status = dto.status;
    }
    if (dto.isFavorite !== undefined) {
      updateSet.isFavorite = dto.isFavorite;
    }

    const [row] = await this.db
      .insert(problemProgress)
      .values(insertValues)
      .onConflictDoUpdate({
        target: [problemProgress.userId, problemProgress.problemId],
        set: updateSet,
      })
      .returning({
        status: problemProgress.status,
        isFavorite: problemProgress.isFavorite,
        updatedAt: problemProgress.updatedAt,
      });

    if (!row) {
      throw new NotFoundException("Failed to save problem progress");
    }

    return {
      status: row.status as ProblemProgressView["status"],
      isFavorite: row.isFavorite,
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
