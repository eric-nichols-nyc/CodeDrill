import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from "@nestjs/common";
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";
// biome-ignore lint/style/useImportType: Nest uses emitted constructor param metadata
import { PostProblemChatMessageDto } from "./dto/post-problem-chat-message.dto";
// biome-ignore lint/style/useImportType: Nest uses emitted constructor param metadata
import { ProblemChatService } from "./problem-chat.service";

/**
 * Per-user problem tutor chat history. Requires Better Auth session (no internal-secret bypass).
 */
@Controller("problems")
export class ProblemChatController {
  private readonly problemChatService: ProblemChatService;

  constructor(problemChatService: ProblemChatService) {
    this.problemChatService = problemChatService;
  }

  @Get(":problemId/chat/messages")
  getMessages(
    @Param("problemId", ParseUUIDPipe) problemId: string,
    @Session() session: UserSession
  ) {
    return this.problemChatService.getThreadMessages(session.user.id, problemId);
  }

  @Post(":problemId/chat/messages")
  @HttpCode(201)
  postMessage(
    @Param("problemId", ParseUUIDPipe) problemId: string,
    @Body() body: PostProblemChatMessageDto,
    @Session() session: UserSession
  ) {
    return this.problemChatService.postTutorMessage(
      session.user.id,
      problemId,
      body
    );
  }
}
