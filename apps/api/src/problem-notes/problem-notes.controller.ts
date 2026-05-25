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
// biome-ignore lint/style/useImportType: Nest ValidationPipe needs the runtime class
import { UpsertProblemNoteDto } from "./dto/upsert-problem-note.dto";
import {
  ProblemsUserGuard,
  type RequestWithUserId,
} from "../problem-workspace-code/guards/problems-user.guard";
// biome-ignore lint/style/useImportType: Nest uses emitted constructor param metadata
import { ProblemNotesService } from "./problem-notes.service";

/**
 * Per-user scratch-pad notes for a problem (Notes tab).
 *
 * Access: Better Auth session via Bearer token or session cookie.
 */
@AllowAnonymous()
@Controller("problems")
@UseGuards(ProblemsUserGuard)
export class ProblemNotesController {
  private readonly notesService: ProblemNotesService;

  constructor(notesService: ProblemNotesService) {
    this.notesService = notesService;
  }

  @Get(":problemId/notes")
  get(
    @Param("problemId", ParseUUIDPipe) problemId: string,
    @Req() request: RequestWithUserId
  ) {
    return this.notesService.getForUser(request.userId!, problemId);
  }

  @Put(":problemId/notes")
  @HttpCode(200)
  upsert(
    @Param("problemId", ParseUUIDPipe) problemId: string,
    @Body() body: UpsertProblemNoteDto,
    @Req() request: RequestWithUserId
  ) {
    return this.notesService.upsertForUser(request.userId!, problemId, body);
  }
}
