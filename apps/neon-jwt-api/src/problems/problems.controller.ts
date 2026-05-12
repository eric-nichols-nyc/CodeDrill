import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, UseGuards } from "@nestjs/common";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";
// biome-ignore lint/style/useImportType: Nest uses emitted constructor param metadata
import { CreateProblemDto } from "./dto/create-problem.dto";
// biome-ignore lint/style/useImportType: Nest uses emitted constructor param metadata
import { ListProblemsQueryDto } from "./dto/list-problems-query.dto";
import { ProblemsAccessGuard } from "./guards/problems-access.guard";
// biome-ignore lint/style/useImportType: Nest uses emitted constructor param metadata
import { ProblemsService } from "./problems.service";

/**
 * Access: Better Auth session **or** `x-internal-problems-secret` matching `INTERNAL_PROBLEMS_SECRET`
 * (used by the Next.js admin BFF when Neon Auth does not share cookies with this API).
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

  @Get()
  findAll(@Query() query: ListProblemsQueryDto) {
    return this.problemsService.findAll(query);
  }

  /** Must stay above `:id` so `by-slug/...` is not parsed as a UUID. */
  @Get("by-slug/:slug")
  findBySlug(@Param("slug") slug: string) {
    return this.problemsService.findBySlugWithDetails(slug);
  }

  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.problemsService.findOne(id);
  }
}
