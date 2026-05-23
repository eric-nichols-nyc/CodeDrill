import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";
import type { Response } from "express";
// biome-ignore lint/style/useImportType: Nest uses emitted constructor param metadata
import { PostProblemChatMessageDto } from "./dto/post-problem-chat-message.dto";
// biome-ignore lint/style/useImportType: Nest uses emitted constructor param metadata
import { ProblemChatService } from "./problem-chat.service";
import {
  ProblemsUserGuard,
  type RequestWithUserId,
} from "../problem-workspace-code/guards/problems-user.guard";

/**
 * Per-user problem tutor chat history.
 *
 * Access: Better Auth session via Bearer token or session cookie.
 */
@AllowAnonymous()
@Controller("problems")
@UseGuards(ProblemsUserGuard)
export class ProblemChatController {
  private readonly problemChatService: ProblemChatService;

  constructor(problemChatService: ProblemChatService) {
    this.problemChatService = problemChatService;
  }

  @Get(":problemId/chat/messages")
  getMessages(
    @Param("problemId", ParseUUIDPipe) problemId: string,
    @Req() request: RequestWithUserId
  ) {
    return this.problemChatService.getThreadMessages(
      request.userId!,
      problemId
    );
  }

  @Post(":problemId/chat/messages")
  @HttpCode(201)
  postMessage(
    @Param("problemId", ParseUUIDPipe) problemId: string,
    @Body() body: PostProblemChatMessageDto,
    @Req() request: RequestWithUserId
  ) {
    return this.problemChatService.postTutorMessage(
      request.userId!,
      problemId,
      body
    );
  }

  @Post(":problemId/chat/messages/stream")
  postMessageStream(
    @Param("problemId", ParseUUIDPipe) problemId: string,
    @Body() body: PostProblemChatMessageDto,
    @Req() request: RequestWithUserId,
    @Res() response: Response
  ) {
    return this.problemChatService.postTutorMessageStream(
      request.userId!,
      problemId,
      body,
      response
    );
  }
}
