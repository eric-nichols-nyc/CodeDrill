import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";
// biome-ignore lint/style/useImportType: Nest uses emitted constructor param metadata
import { UpsertWorkspaceCodeDto } from "./dto/upsert-workspace-code.dto";
import {
  ProblemsUserGuard,
  type RequestWithUserId,
} from "./guards/problems-user.guard";
// biome-ignore lint/style/useImportType: Nest uses emitted constructor param metadata
import { ProblemWorkspaceCodeService } from "./problem-workspace-code.service";

/**
 * Per-user saved editor code (e.g. persisted when the user clicks Run).
 *
 * Access: Better Auth session **or** `x-internal-problems-secret` + `x-user-id`
 * (Next BFF after Neon Auth). `@AllowAnonymous()` skips the global guard so
 * `ProblemsUserGuard` can enforce that policy.
 */
@AllowAnonymous()
@Controller("problems")
@UseGuards(ProblemsUserGuard)
export class ProblemWorkspaceCodeController {
  private readonly workspaceCodeService: ProblemWorkspaceCodeService;

  constructor(workspaceCodeService: ProblemWorkspaceCodeService) {
    this.workspaceCodeService = workspaceCodeService;
  }

  @Get(":problemId/workspace-code")
  list(
    @Param("problemId", ParseUUIDPipe) problemId: string,
    @Req() request: RequestWithUserId
  ) {
    return this.workspaceCodeService.listForUser(request.userId!, problemId);
  }

  @Put(":problemId/workspace-code")
  @HttpCode(200)
  upsert(
    @Param("problemId", ParseUUIDPipe) problemId: string,
    @Body() body: UpsertWorkspaceCodeDto,
    @Req() request: RequestWithUserId
  ) {
    return this.workspaceCodeService.upsertForUser(
      request.userId!,
      problemId,
      body
    );
  }
}
