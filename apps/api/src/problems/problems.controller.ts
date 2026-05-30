import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { IncomingHttpHeaders } from "node:http";
// biome-ignore lint/style/useImportType: Nest uses emitted constructor param metadata
import { CreateProblemDto } from "./dto/create-problem.dto";
// biome-ignore lint/style/useImportType: Nest uses emitted constructor param metadata
import { GenerateProblemFromPromptDto } from "./dto/generate-problem-from-prompt.dto";
// biome-ignore lint/style/useImportType: Nest uses emitted constructor param metadata
import { ListProblemsQueryDto } from "./dto/list-problems-query.dto";
import { ProblemsAccessGuard } from "./guards/problems-access.guard";
import { resolveCatalogAccess } from "./resolve-catalog-access";
// biome-ignore lint/style/useImportType: Nest uses emitted constructor param metadata
import { ProblemGenerateService } from "./problem-generate.service";
// biome-ignore lint/style/useImportType: Nest uses emitted constructor param metadata
import { ProblemsService } from "./problems.service";

/**
 * Reads: public (published catalog). Privileged reads (include drafts) with Clerk JWT
 * or `x-internal-problems-secret`. Writes: Clerk JWT or internal secret (guard).
 */
@Controller("problems")
export class ProblemsController {
  private readonly problemsService: ProblemsService;
  private readonly problemGenerateService: ProblemGenerateService;

  constructor(
    problemsService: ProblemsService,
    problemGenerateService: ProblemGenerateService
  ) {
    this.problemsService = problemsService;
    this.problemGenerateService = problemGenerateService;
  }

  @Post()
  @UseGuards(ProblemsAccessGuard)
  create(@Body() body: CreateProblemDto) {
    return this.problemsService.create(body);
  }

  /** Must stay above `:id` routes so `generate` is not parsed as a UUID. */
  @Post("generate")
  @UseGuards(ProblemsAccessGuard)
  generateFromPrompt(@Body() body: GenerateProblemFromPromptDto) {
    return this.problemGenerateService.generateFromPrompt(body.prompt);
  }

  @Put(":id")
  @UseGuards(ProblemsAccessGuard)
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: CreateProblemDto
  ) {
    return this.problemsService.update(id, body);
  }

  @Get()
  async findAll(
    @Query() query: ListProblemsQueryDto,
    @Req() request: { headers: IncomingHttpHeaders }
  ) {
    const access = await resolveCatalogAccess(request.headers ?? {});
    return this.problemsService.findAll(query, access);
  }

  /** Must stay above `:id` so `by-slug/...` is not parsed as a UUID. */
  @Get("by-slug/:slug")
  async findBySlug(
    @Param("slug") slug: string,
    @Req() request: { headers: IncomingHttpHeaders }
  ) {
    const access = await resolveCatalogAccess(request.headers ?? {});
    return this.problemsService.findBySlugWithDetails(slug, access);
  }

  @Get(":id/details")
  async findDetails(
    @Param("id", ParseUUIDPipe) id: string,
    @Req() request: { headers: IncomingHttpHeaders }
  ) {
    const access = await resolveCatalogAccess(request.headers ?? {});
    return this.problemsService.findByIdWithDetails(id, access);
  }

  @Get(":id")
  async findOne(
    @Param("id", ParseUUIDPipe) id: string,
    @Req() request: { headers: IncomingHttpHeaders }
  ) {
    const access = await resolveCatalogAccess(request.headers ?? {});
    return this.problemsService.findOne(id, access);
  }
}
