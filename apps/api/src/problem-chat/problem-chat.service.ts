import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { and, asc, eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import {
  problemChatMessages,
  problemChatThreads,
  problems,
  schema,
} from "../database/schema";
import type { PostProblemChatMessageDto } from "./dto/post-problem-chat-message.dto";

type AppDb = NeonHttpDatabase<typeof schema>;

@Injectable()
export class ProblemChatService {
  private readonly db: AppDb;

  constructor(@Inject("DRIZZLE") db: AppDb) {
    this.db = db;
  }

  private async assertProblemExists(problemId: string) {
    const [row] = await this.db
      .select({ id: problems.id })
      .from(problems)
      .where(eq(problems.id, problemId))
      .limit(1);

    if (!row) {
      throw new NotFoundException(`Problem not found: ${problemId}`);
    }
  }

  private async getOrCreateThread(userId: string, problemId: string) {
    await this.assertProblemExists(problemId);

    const [thread] = await this.db
      .insert(problemChatThreads)
      .values({
        userId,
        problemId,
      })
      .onConflictDoUpdate({
        target: [problemChatThreads.userId, problemChatThreads.problemId],
        set: { updatedAt: new Date() },
      })
      .returning();

    if (!thread) {
      throw new Error("Failed to resolve problem chat thread");
    }

    return thread;
  }

  async getThreadMessages(userId: string, problemId: string) {
    const thread = await this.getOrCreateThread(userId, problemId);

    const messages = await this.db
      .select()
      .from(problemChatMessages)
      .where(eq(problemChatMessages.threadId, thread.id))
      .orderBy(asc(problemChatMessages.createdAt))
      .limit(500);

    return {
      thread: {
        id: thread.id,
        userId: thread.userId,
        problemId: thread.problemId,
        createdAt: thread.createdAt.toISOString(),
        updatedAt: thread.updatedAt.toISOString(),
      },
      messages: messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        metadata: m.metadata ?? null,
        createdAt: m.createdAt.toISOString(),
      })),
    };
  }

  async appendUserMessage(
    userId: string,
    problemId: string,
    dto: PostProblemChatMessageDto
  ) {
    const thread = await this.getOrCreateThread(userId, problemId);

    const [message] = await this.db
      .insert(problemChatMessages)
      .values({
        threadId: thread.id,
        role: "user",
        content: dto.content,
        metadata: dto.metadata,
      })
      .returning();

    if (!message) {
      throw new Error("Failed to insert chat message");
    }

    await this.db
      .update(problemChatThreads)
      .set({ updatedAt: new Date() })
      .where(
        and(
          eq(problemChatThreads.id, thread.id),
          eq(problemChatThreads.userId, userId)
        )
      );

    return {
      message: {
        id: message.id,
        role: message.role,
        content: message.content,
        metadata: message.metadata ?? null,
        createdAt: message.createdAt.toISOString(),
      },
    };
  }
}
