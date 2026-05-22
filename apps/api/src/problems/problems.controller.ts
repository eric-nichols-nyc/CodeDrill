import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";
// biome-ignore lint/style/useImportType: Nest uses emitted constructor param metadata
import { CreateProblemDto } from "./dto/create-problem.dto";
// biome-ignore lint/style/useImportType: Nest uses emitted constructor param metadata
import { ListProblemsQueryDto } from "./dto/list-problems-query.dto";
import { ProblemsAccessGuard } from "./guards/problems-access.guard";
// biome-ignore lint/style/useImportType: Nest uses emitted constructor param metadata
import { ProblemsService } from "./problems.service";

/**
 * Access: Better Auth session (Bearer or cookie) **or** `x-internal-problems-secret`
 * matching `INTERNAL_PROBLEMS_SECRET` for server-to-server catalog/admin BFF calls.
 */
@AllowAnonymous()
@UseGuards(ProblemsAccessGuard)
@Controller("problems")
export class ProblemsController {
  private readonly problemsService: ProblemsService;

  constructor(problemsService: ProblemsService) {
    this.problemsService = problemsService;
  }

  @Post()
  create(@Body() body: CreateProblemDto) {
    return this.problemsService.create(body);
  }

  @Put(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: CreateProblemDto
  ) {
    return this.problemsService.update(id, body);
  }

  @Get()
  findAll(@Query() query: ListProblemsQueryDto) {
    return this.problemsService.findAll(query);
  }

  /** Must stay above `:id` so `by-slug/...` is not parsed as a UUID. */
  @Get("by-slug/:slug")
  findBySlug(@Param("slug") slug: string) {
    return this.problemsService.findBySlugWithDetails(slug);
  }

  @Get(":id/details")
  findDetails(@Param("id", ParseUUIDPipe) id: string) {
    return this.problemsService.findByIdWithDetails(id);
  }

  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.problemsService.findOne(id);
  }
}
