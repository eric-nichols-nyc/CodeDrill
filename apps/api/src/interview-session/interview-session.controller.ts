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
import { CreateInterviewSessionDto } from "./dto/create-interview-session.dto";
import { GenerateInterviewSessionDto } from "./dto/generate-interview-session.dto";
import { SubmitAnswerDto } from "./dto/submit-answer.dto";
import {
  ProblemsUserGuard,
  type RequestWithUserId,
} from "../problem-workspace-code/guards/problems-user.guard";
// biome-ignore lint/style/useImportType: Nest uses emitted constructor param metadata
import { InterviewSessionGenerateService } from "./interview-session-generate.service";
// biome-ignore lint/style/useImportType: Nest uses emitted constructor param metadata
import { InterviewSessionPersistService } from "./interview-session-persist.service";
// biome-ignore lint/style/useImportType: Nest uses emitted constructor param metadata
import { InterviewSessionSeedService } from "./interview-session-seed.service";
// biome-ignore lint/style/useImportType: Nest uses emitted constructor param metadata
import { InterviewSessionService } from "./interview-session.service";

@Controller("interview/sessions")
@UseGuards(ProblemsUserGuard)
export class InterviewSessionController {
  private readonly sessionService: InterviewSessionService;
  private readonly seedService: InterviewSessionSeedService;
  private readonly generateService: InterviewSessionGenerateService;
  private readonly persistService: InterviewSessionPersistService;

  constructor(
    sessionService: InterviewSessionService,
    seedService: InterviewSessionSeedService,
    generateService: InterviewSessionGenerateService,
    persistService: InterviewSessionPersistService
  ) {
    this.sessionService = sessionService;
    this.seedService = seedService;
    this.generateService = generateService;
    this.persistService = persistService;
  }

  /** AI blueprint preview — does not persist. */
  @Post("generate")
  @HttpCode(200)
  generate(
    @Body() body: GenerateInterviewSessionDto,
    @Req() request: RequestWithUserId
  ) {
    return this.generateService.generatePreviewForUser(
      request.userId!,
      body
    );
  }

  /** Persist confirmed blueprint as a playable session. */
  @Post()
  @HttpCode(201)
  create(
    @Body() body: CreateInterviewSessionDto,
    @Req() request: RequestWithUserId
  ) {
    return this.persistService.createFromBlueprint(
      request.userId!,
      body.profileId,
      body.jobAnalysisId,
      body.blueprint
    );
  }

  /** Dev/demo: quick 3-question session from latest profile + job analysis. */
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
