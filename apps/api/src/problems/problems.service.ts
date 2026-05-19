import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { asc, eq, inArray } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import {
  problemExamples,
  problemHints,
  problemLearningNotes,
  problemSolutions,
  problemTags,
  problems,
  schema,
  starterCode,
  tags,
  testCases,
} from "../database/schema";
import type { CreateProblemDto } from "./dto/create-problem.dto";
import type { ListProblemsQueryDto } from "./dto/list-problems-query.dto";
import { editorialDtoToDbText } from "./editorial-db";

type AppDb = NeonHttpDatabase<typeof schema>;

@Injectable()
export class ProblemsService {
  private readonly db: AppDb;

  constructor(@Inject("DRIZZLE") db: AppDb) {
    this.db = db;
  }

  async create(dto: CreateProblemDto) {
    const [createdProblem] = await this.db
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
        editorial: editorialDtoToDbText(dto.editorial),
      })
      .returning();

    await this.writeProblemRelations(createdProblem.id, dto);

    return createdProblem;
  }

  async update(id: string, dto: CreateProblemDto) {
    const [updatedProblem] = await this.db
      .update(problems)
      .set({
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
        editorial: editorialDtoToDbText(dto.editorial),
        updatedAt: new Date(),
      })
      .where(eq(problems.id, id))
      .returning();

    if (!updatedProblem) {
      throw new NotFoundException(`Problem not found: ${id}`);
    }

    await this.db.delete(problemTags).where(eq(problemTags.problemId, id));
    await this.db.delete(starterCode).where(eq(starterCode.problemId, id));
    await this.db
      .delete(problemExamples)
      .where(eq(problemExamples.problemId, id));
    await this.db.delete(problemHints).where(eq(problemHints.problemId, id));
    await this.db
      .delete(problemSolutions)
      .where(eq(problemSolutions.problemId, id));
    await this.db.delete(testCases).where(eq(testCases.problemId, id));

    await this.writeProblemRelations(id, dto);

    return updatedProblem;
  }

  async findAll(query: ListProblemsQueryDto) {
    const rows =
      query.published === undefined
        ? await this.db.select().from(problems)
        : await this.db
            .select()
            .from(problems)
            .where(eq(problems.isPublished, query.published));

    if (rows.length === 0) {
      return [];
    }

    const problemIds = rows.map((row) => row.id);
    const tagRows = await this.db
      .select({
        problemId: problemTags.problemId,
        id: tags.id,
        name: tags.name,
        slug: tags.slug,
      })
      .from(problemTags)
      .innerJoin(tags, eq(problemTags.tagId, tags.id))
      .where(inArray(problemTags.problemId, problemIds))
      .orderBy(asc(tags.name));

    const tagsByProblemId = new Map<
      string,
      { id: string; name: string; slug: string }[]
    >();

    for (const tag of tagRows) {
      const list = tagsByProblemId.get(tag.problemId) ?? [];
      list.push({ id: tag.id, name: tag.name, slug: tag.slug });
      tagsByProblemId.set(tag.problemId, list);
    }

    return rows.map((problem) => ({
      ...problem,
      tags: tagsByProblemId.get(problem.id) ?? [],
    }));
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

  async findBySlugWithDetails(slug: string) {
    const [problem] = await this.db
      .select()
      .from(problems)
      .where(eq(problems.slug, slug))
      .limit(1);

    if (!problem) {
      throw new NotFoundException(`Problem not found: ${slug}`);
    }

    return this.buildProblemDetails(problem);
  }

  async findByIdWithDetails(id: string) {
    const [problem] = await this.db
      .select()
      .from(problems)
      .where(eq(problems.id, id))
      .limit(1);

    if (!problem) {
      throw new NotFoundException(`Problem not found: ${id}`);
    }

    return this.buildProblemDetails(problem);
  }

  private async buildProblemDetails(problem: typeof problems.$inferSelect) {
    const problemId = problem.id;

    const [examples, hints, starterCodeRows, learningNotes, solutions, tagRows, testCaseRows] =
      await Promise.all([
      this.db
        .select()
        .from(problemExamples)
        .where(eq(problemExamples.problemId, problemId))
        .orderBy(asc(problemExamples.sortOrder)),
      this.db
        .select()
        .from(problemHints)
        .where(eq(problemHints.problemId, problemId))
        .orderBy(asc(problemHints.sortOrder)),
      this.db.select().from(starterCode).where(eq(starterCode.problemId, problemId)),
      this.db
        .select()
        .from(problemLearningNotes)
        .where(eq(problemLearningNotes.problemId, problemId))
        .orderBy(asc(problemLearningNotes.sortOrder)),
      this.db
        .select()
        .from(problemSolutions)
        .where(eq(problemSolutions.problemId, problemId))
        .orderBy(asc(problemSolutions.createdAt)),
      this.db
        .select({
          id: tags.id,
          name: tags.name,
          slug: tags.slug,
        })
        .from(problemTags)
        .innerJoin(tags, eq(problemTags.tagId, tags.id))
        .where(eq(problemTags.problemId, problemId)),
      this.db
        .select()
        .from(testCases)
        .where(eq(testCases.problemId, problemId))
        .orderBy(asc(testCases.sortOrder)),
    ]);

    return {
      problem,
      tags: tagRows,
      examples,
      hints,
      starterCode: starterCodeRows,
      learningNotes,
      solutions,
      testCases: testCaseRows,
    };
  }

  private async writeProblemRelations(problemId: string, dto: CreateProblemDto) {
    const normalizedStarterCode = dto.starterCode.map((row) => ({
      language: normalizeLanguage(row.language),
      code: row.code,
      functionName: trimToUndefined(row.functionName),
    }));
    const normalizedSolutions =
      dto.solutions?.map((row) => ({
        language: normalizeLanguage(row.language),
        code: row.code,
        explanation: trimToUndefined(row.explanation),
        timeComplexity: trimToUndefined(row.timeComplexity),
        spaceComplexity: trimToUndefined(row.spaceComplexity),
      })) ?? [];
    const normalizedTags = normalizeTags(dto.tags ?? []);

    assertUniqueLanguages(normalizedStarterCode, "starterCode");
    assertUniqueLanguages(normalizedSolutions, "solutions");

    if (normalizedTags.length > 0) {
      await this.db.insert(tags).values(normalizedTags).onConflictDoNothing();

      const tagRows = await this.db
        .select({ id: tags.id, slug: tags.slug })
        .from(tags)
        .where(inArray(tags.slug, normalizedTags.map((tag) => tag.slug)));

      if (tagRows.length > 0) {
        await this.db
          .insert(problemTags)
          .values(tagRows.map((tag) => ({ problemId, tagId: tag.id })))
          .onConflictDoNothing();
      }
    }

    await this.db.insert(starterCode).values(
      normalizedStarterCode.map((row) => ({
        problemId,
        language: row.language,
        code: row.code,
        functionName: row.functionName,
      }))
    );

    if (dto.examples && dto.examples.length > 0) {
      await this.db.insert(problemExamples).values(
        dto.examples.map((example, index) => ({
          problemId,
          input: example.input,
          output: example.output,
          explanation: trimToUndefined(example.explanation),
          sortOrder: example.sortOrder ?? index,
        }))
      );
    }

    if (dto.hints && dto.hints.length > 0) {
      await this.db.insert(problemHints).values(
        dto.hints.map((hint, index) => ({
          problemId,
          title: trimToUndefined(hint.title),
          body: hint.body,
          sortOrder: hint.sortOrder ?? index,
        }))
      );
    }

    if (normalizedSolutions.length > 0) {
      await this.db.insert(problemSolutions).values(
        normalizedSolutions.map((solution) => ({
          problemId,
          language: solution.language,
          code: solution.code,
          explanation: solution.explanation,
          timeComplexity: solution.timeComplexity,
          spaceComplexity: solution.spaceComplexity,
        }))
      );
    }

    if (dto.testCases && dto.testCases.length > 0) {
      await this.db.insert(testCases).values(
        dto.testCases.map((testCase, index) => ({
          problemId,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          isSample: testCase.isSample ?? false,
          sortOrder: testCase.sortOrder ?? index,
        }))
      );
    }
  }
}

function trimToUndefined(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeLanguage(language: string): string {
  return language.trim().toLowerCase();
}

function slugifyTag(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeTags(values: string[]) {
  const deduped = new Map<string, { name: string; slug: string }>();

  for (const value of values) {
    const name = value.trim();
    if (!name) {
      continue;
    }

    const slug = slugifyTag(name);
    if (!slug || deduped.has(slug)) {
      continue;
    }

    deduped.set(slug, { name, slug });
  }

  return [...deduped.values()];
}

function assertUniqueLanguages(
  rows: { language: string }[],
  fieldName: "starterCode" | "solutions"
) {
  const seen = new Set<string>();

  for (const row of rows) {
    if (seen.has(row.language)) {
      throw new BadRequestException(
        `Duplicate language "${row.language}" in ${fieldName}.`
      );
    }
    seen.add(row.language);
  }
}
