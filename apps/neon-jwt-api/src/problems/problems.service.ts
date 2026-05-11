import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { problems } from "../database/practice-schema";
// biome-ignore lint/style/useImportType: typeof schema used for Drizzle generic
import { schema } from "../database/schema";
import type { CreateProblemDto } from "./dto/create-problem.dto";
import type { ListProblemsQueryDto } from "./dto/list-problems-query.dto";

type AppDb = NeonHttpDatabase<typeof schema>;

@Injectable()
export class ProblemsService {
  private readonly db: AppDb;

  constructor(@Inject("DRIZZLE") db: AppDb) {
    this.db = db;
  }

  async create(dto: CreateProblemDto) {
    const [row] = await this.db
      .insert(problems)
      .values({
        title: dto.title,
        slug: dto.slug,
        difficulty: dto.difficulty,
        description: dto.description,
        constraints: dto.constraints,
        isPublished: dto.isPublished ?? false,
        patternSlug: dto.patternSlug,
        loopStructure: dto.loopStructure,
        skillFocus: dto.skillFocus,
        tutorLevel: dto.tutorLevel,
        visualizationNotes: dto.visualizationNotes,
      })
      .returning();

    return row;
  }

  findAll(query: ListProblemsQueryDto) {
    if (query.published === undefined) {
      return this.db.select().from(problems);
    }
    return this.db
      .select()
      .from(problems)
      .where(eq(problems.isPublished, query.published));
  }

  async findOne(id: string) {
    const [row] = await this.db
      .select()
      .from(problems)
      .where(eq(problems.id, id))
      .limit(1);

    if (!row) {
      throw new NotFoundException(`Problem not found: ${id}`);
    }

    return row;
  }
}
