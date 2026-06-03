import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { SubmitAnswerDto } from "./dto/submit-answer.dto";
import {
  ProblemsUserGuard,
  type RequestWithUserId,
} from "../problem-workspace-code/guards/problems-user.guard";
// biome-ignore lint/style/useImportType: Nest uses emitted constructor param metadata
import { InterviewSessionSeedService } from "./interview-session-seed.service";
// biome-ignore lint/style/useImportType: Nest uses emitted constructor param metadata
import { InterviewSessionService } from "./interview-session.service";

@Controller("interview/sessions")
@UseGuards(ProblemsUserGuard)
export class InterviewSessionController {
  private readonly sessionService: InterviewSessionService;
  private readonly seedService: InterviewSessionSeedService;

  constructor(
    sessionService: InterviewSessionService,
    seedService: InterviewSessionSeedService
  ) {
    this.sessionService = sessionService;
    this.seedService = seedService;
  }

  /** Dev/demo: create a playable session from latest profile + job analysis. */
  @Post("seed")
  @HttpCode(201)
  seed(@Req() request: RequestWithUserId) {
    return this.seedService.seedDemoSessionForUser(request.userId!);
  }

  @Get(":interviewId")
  getOne(
    @Param("interviewId", ParseUUIDPipe) interviewId: string,
    @Req() request: RequestWithUserId
  ) {
    return this.sessionService.getByIdForUser(request.userId!, interviewId);
  }

  @Post(":interviewId/start")
  @HttpCode(200)
  start(
    @Param("interviewId", ParseUUIDPipe) interviewId: string,
    @Req() request: RequestWithUserId
  ) {
    return this.sessionService.startForUser(request.userId!, interviewId);
  }

  @Post(":interviewId/questions/:questionId/answer")
  @HttpCode(200)
  submitAnswer(
    @Param("interviewId", ParseUUIDPipe) interviewId: string,
    @Param("questionId", ParseUUIDPipe) questionId: string,
    @Body() body: SubmitAnswerDto,
    @Req() request: RequestWithUserId
  ) {
    return this.sessionService.submitAnswerForUser(
      request.userId!,
      interviewId,
      questionId,
      body
    );
  }

  @Post(":interviewId/complete")
  @HttpCode(200)
  complete(
    @Param("interviewId", ParseUUIDPipe) interviewId: string,
    @Req() request: RequestWithUserId
  ) {
    return this.sessionService.completeForUser(request.userId!, interviewId);
  }
}
