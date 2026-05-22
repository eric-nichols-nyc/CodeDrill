import {
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { and, asc, eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import {
  problemChatMessages,
  problemChatThreads,
  problems,
  type schema,
} from "../database/schema";
import { ProblemsService } from "../problems/problems.service";
import type { PostProblemChatMessageDto } from "./dto/post-problem-chat-message.dto";
import { buildProblemContext } from "./problem-context.builder";
import type {
  ProblemChatMessageDto,
  ProblemChatThreadDto,
  PostProblemChatMessageResponse,
} from "./problem-chat.types";
import { buildTutorSystemPrompt } from "./tutor-prompt.builder";

type AppDb = NeonHttpDatabase<typeof schema>;

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const CHAT_MODEL = "gpt-4o-mini";

type StoredMessage = typeof problemChatMessages.$inferSelect;
type StoredThread = typeof problemChatThreads.$inferSelect;

type OpenAiCompletion = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  error?: {
    message?: string;
  };
};

@Injectable()
export class ProblemChatService {
  private readonly db: AppDb;
  private readonly problemsService: ProblemsService;

  constructor(@Inject("DRIZZLE") db: AppDb, problemsService: ProblemsService) {
    this.db = db;
    this.problemsService = problemsService;
  }

  private serializeThread(thread: StoredThread): ProblemChatThreadDto {
    return {
      id: thread.id,
      userId: thread.userId,
      problemId: thread.problemId,
      createdAt: thread.createdAt.toISOString(),
      updatedAt: thread.updatedAt.toISOString(),
    };
  }

  private serializeMessage(message: StoredMessage): ProblemChatMessageDto {
    return {
      id: message.id,
      role: message.role,
      content: message.content,
      metadata: message.metadata ?? null,
      createdAt: message.createdAt.toISOString(),
    };
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

  private async touchThread(threadId: string, userId: string) {
    await this.db
      .update(problemChatThreads)
      .set({ updatedAt: new Date() })
      .where(
        and(
          eq(problemChatThreads.id, threadId),
          eq(problemChatThreads.userId, userId)
        )
      );
  }

  private async insertMessage(input: {
    threadId: string;
    role: "user" | "assistant" | "system";
    content: string;
    metadata?: Record<string, unknown>;
  }) {
    const [message] = await this.db
      .insert(problemChatMessages)
      .values({
        threadId: input.threadId,
        role: input.role,
        content: input.content,
        metadata: input.metadata,
      })
      .returning();

    if (!message) {
      throw new Error(`Failed to insert ${input.role} chat message`);
    }

    return message;
  }

  private async getRecentMessages(threadId: string) {
    return this.db
      .select()
      .from(problemChatMessages)
      .where(eq(problemChatMessages.threadId, threadId))
      .orderBy(asc(problemChatMessages.createdAt))
      .limit(50);
  }

  private readOpenAiAssistantContent(
    completion: OpenAiCompletion
  ): string | null {
    const content = completion.choices?.[0]?.message?.content;
    return typeof content === "string" ? content.trim() : null;
  }

  private readOpenAiErrorMessage(
    completion: OpenAiCompletion,
    httpStatus: number
  ) {
    const msg = completion.error?.message;
    return typeof msg === "string" && msg.length > 0
      ? msg
      : `OpenAI error (${httpStatus})`;
  }

  private buildContextMessage(input: {
    problemContext: ReturnType<typeof buildProblemContext>;
    code?: string;
    language?: string;
  }) {
    const { problemContext, code, language } = input;

    return JSON.stringify(
      {
        problemContext,
        currentCode: code?.trim() || null,
        currentLanguage: language?.trim() || null,
      },
      null,
      2
    );
  }

  private tutorErrorReply(
    summary: string,
    metadata?: Record<string, unknown>
  ) {
    return {
      content: summary,
      metadata: {
        model: CHAT_MODEL,
        tutorError: true,
        ...metadata,
      },
    };
  }

  private async generateTutorReply(input: {
    systemPrompt: string;
    problemContext: ReturnType<typeof buildProblemContext>;
    history: Array<{ role: "user" | "assistant" | "system"; content: string }>;
    userMessage: string;
    code?: string;
    language?: string;
  }) {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      return {
        content:
          "The tutor is not configured yet (`OPENAI_API_KEY` is missing on the API). Your message was saved — add the key to **apps/api/.env** and restart the API.",
        metadata: {
          model: "stub-no-openai-key",
        },
      };
    }

    const history = input.history.filter(
      (message): message is { role: "user" | "assistant"; content: string } =>
        message.role === "user" || message.role === "assistant"
    );

    try {
      const upstream = await fetch(OPENAI_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: CHAT_MODEL,
          temperature: 0.3,
          messages: [
            { role: "system", content: input.systemPrompt },
            {
              role: "system",
              content: this.buildContextMessage({
                problemContext: input.problemContext,
                code: input.code,
                language: input.language,
              }),
            },
            ...history,
            { role: "user", content: input.userMessage },
          ],
        }),
      });

      const rawText = await upstream.text();

      let completion: OpenAiCompletion;
      try {
        completion = JSON.parse(rawText) as OpenAiCompletion;
      } catch {
        return this.tutorErrorReply(
          "OpenAI returned a response the tutor could not parse. Check the API key and try again."
        );
      }

      if (!upstream.ok) {
        return this.tutorErrorReply(
          `OpenAI error (${upstream.status}): ${this.readOpenAiErrorMessage(completion, upstream.status)}`
        );
      }

      const content = this.readOpenAiAssistantContent(completion);
      if (!content) {
        return this.tutorErrorReply(
          "OpenAI returned an empty reply. Try sending your message again."
        );
      }

      return {
        content,
        metadata: {
          model: CHAT_MODEL,
        },
      };
    } catch (error) {
      const message =
        error instanceof Error && error.message.length > 0
          ? error.message
          : "Unknown network error";
      return this.tutorErrorReply(
        `The tutor could not reach OpenAI: ${message}`
      );
    }
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
      thread: this.serializeThread(thread),
      messages: messages.map((message) => this.serializeMessage(message)),
    };
  }

  async postTutorMessage(
    userId: string,
    problemId: string,
    dto: PostProblemChatMessageDto
  ): Promise<PostProblemChatMessageResponse> {
    const thread = await this.getOrCreateThread(userId, problemId);

    const userMessage = await this.insertMessage({
      threadId: thread.id,
      role: "user",
      content: dto.content,
      metadata: dto.metadata,
    });

    await this.touchThread(thread.id, userId);

    const problemDetails =
      await this.problemsService.findByIdWithDetails(problemId);
    const problemContext = buildProblemContext(problemDetails);

    const historyRows = await this.getRecentMessages(thread.id);
    const history = historyRows
      .filter((message) => message.id !== userMessage.id)
      .map((message) => ({
        role: message.role as "user" | "assistant" | "system",
        content: message.content,
      }));

    const metadata = dto.metadata ?? {};
    const code = typeof metadata.code === "string" ? metadata.code : undefined;
    const language =
      typeof metadata.language === "string" ? metadata.language : undefined;

    const assistantReply = await this.generateTutorReply({
      systemPrompt: buildTutorSystemPrompt(problemContext),
      problemContext,
      history,
      userMessage: dto.content,
      code,
      language,
    });

    const assistantMessage = await this.insertMessage({
      threadId: thread.id,
      role: "assistant",
      content: assistantReply.content,
      metadata: assistantReply.metadata,
    });

    await this.touchThread(thread.id, userId);

    const refreshedThread = await this.getOrCreateThread(userId, problemId);

    return {
      thread: this.serializeThread(refreshedThread),
      userMessage: this.serializeMessage(userMessage),
      assistantMessage: this.serializeMessage(assistantMessage),
    };
  }
}
