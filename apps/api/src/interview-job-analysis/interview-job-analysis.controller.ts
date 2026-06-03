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
import {
  GenerateJobAnalysisDto,
  SaveJobAnalysisDto,
} from "./dto/job-analysis-payload.dto";
import {
  ProblemsUserGuard,
  type RequestWithUserId,
} from "../problem-workspace-code/guards/problems-user.guard";
// biome-ignore lint/style/useImportType: Nest uses emitted constructor param metadata
import { InterviewJobAnalysisGenerateService } from "./interview-job-analysis-generate.service";
// biome-ignore lint/style/useImportType: Nest uses emitted constructor param metadata
import { InterviewJobAnalysisService } from "./interview-job-analysis.service";

/**
 * Job Analysis System — job description → structured hiring intelligence → persistence.
 *
 * Access: Clerk Bearer JWT (resolved by `ProblemsUserGuard`).
 */
@Controller("interview/job-analyses")
@UseGuards(ProblemsUserGuard)
export class InterviewJobAnalysisController {
  private readonly jobAnalysisService: InterviewJobAnalysisService;
  private readonly generateService: InterviewJobAnalysisGenerateService;

  constructor(
    jobAnalysisService: InterviewJobAnalysisService,
    generateService: InterviewJobAnalysisGenerateService
  ) {
    this.jobAnalysisService = jobAnalysisService;
    this.generateService = generateService;
  }

  /** AI extraction only — does not persist. */
  @Post("generate")
  @HttpCode(200)
  generate(@Body() body: GenerateJobAnalysisDto) {
    return this.generateService.generateFromJobDescription(body);
  }

  @Post()
  @HttpCode(201)
  async save(@Body() body: SaveJobAnalysisDto, @Req() request: RequestWithUserId) {
    const { jobDescription, jobUrl, ...payload } = body;
    return this.jobAnalysisService.saveForUser(
      request.userId!,
      jobDescription,
      jobUrl,
      payload
    );
  }

  @Get("me")
  getLatest(@Req() request: RequestWithUserId) {
    return this.jobAnalysisService.getLatestForUser(request.userId!);
  }

  @Get(":jobAnalysisId")
  getOne(
    @Param("jobAnalysisId", ParseUUIDPipe) jobAnalysisId: string,
    @Req() request: RequestWithUserId
  ) {
    return this.jobAnalysisService.getByIdForUser(
      request.userId!,
      jobAnalysisId
    );
  }
}
