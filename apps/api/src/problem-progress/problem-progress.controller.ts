import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Req,
  UseGuards,
} from "@nestjs/common";
// biome-ignore lint/style/useImportType: Nest ValidationPipe needs the runtime class
import { PatchProblemProgressDto } from "./dto/patch-problem-progress.dto";
import {
  ProblemsUserGuard,
  type RequestWithUserId,
} from "../problem-workspace-code/guards/problems-user.guard";
// biome-ignore lint/style/useImportType: Nest uses emitted constructor param metadata
import { ProblemProgressService } from "./problem-progress.service";

/**
 * Per-user progress for a problem (status, favorite, …).
 *
 * Access: Clerk Bearer JWT (resolved by `ProblemsUserGuard`).
 * Lives under `/problems/:problemId/progress`, not `PUT /problems/:id` (admin catalog).
 */
@Controller("problems")
@UseGuards(ProblemsUserGuard)
export class ProblemProgressController {
  private readonly progressService: ProblemProgressService;

  constructor(progressService: ProblemProgressService) {
    this.progressService = progressService;
  }

  @Get(":problemId/progress")
  get(
    @Param("problemId", ParseUUIDPipe) problemId: string,
    @Req() request: RequestWithUserId
  ) {
    return this.progressService.getForUser(request.userId!, problemId);
  }

  @Patch(":problemId/progress")
  @HttpCode(200)
  patch(
    @Param("problemId", ParseUUIDPipe) problemId: string,
    @Body() body: PatchProblemProgressDto,
    @Req() request: RequestWithUserId
  ) {
    return this.progressService.patchForUser(
      request.userId!,
      problemId,
      body
    );
  }
}
