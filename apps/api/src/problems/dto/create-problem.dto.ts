import { Transform, Type } from "class-transformer";
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from "class-validator";

const difficulties = ["easy", "medium", "hard"] as const;

export class ProblemExampleDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50_000)
  input!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50_000)
  output!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50_000)
  explanation?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number;
}

export class ProblemStarterCodeDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  language!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100_000)
  code!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  functionName?: string;
}

export class ProblemHintDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50_000)
  body!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number;
}

export class ProblemSolutionDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  language!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100_000)
  code!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50_000)
  explanation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  timeComplexity?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  spaceComplexity?: string;
}

export class ProblemTestCaseDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50_000)
  input!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50_000)
  expectedOutput!: string;

  @IsOptional()
  @Transform(({ value }) => value === true || value === "true")
  @IsBoolean()
  isSample?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number;
}

export class EditorialYoutubeEmbedDto {
  @IsIn(["youtube"])
  type!: "youtube";

  @IsString()
  @MinLength(1)
  @MaxLength(32)
  videoId!: string;
}

export class ProblemEditorialDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50_000)
  content?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EditorialYoutubeEmbedDto)
  embeds?: EditorialYoutubeEmbedDto[];
}

export class CreateProblemDto {
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  title!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  slug!: string;

  @IsString()
  @IsIn(difficulties)
  difficulty!: (typeof difficulties)[number];

  @IsString()
  @MinLength(1)
  description!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50_000)
  constraints?: string;

  @IsOptional()
  @Transform(({ value }) => value === true || value === "true")
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  patternSlug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  loopStructure?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  skillFocus?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  tutorLevel?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50_000)
  visualizationNotes?: string;

  /** Optional walkthrough: HTML body + structured embeds (e.g. YouTube). */
  @IsOptional()
  @ValidateNested()
  @Type(() => ProblemEditorialDto)
  editorial?: ProblemEditorialDto;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @MaxLength(100, { each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProblemExampleDto)
  examples?: ProblemExampleDto[];

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProblemStarterCodeDto)
  starterCode!: ProblemStarterCodeDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProblemHintDto)
  hints?: ProblemHintDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProblemSolutionDto)
  solutions?: ProblemSolutionDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProblemTestCaseDto)
  testCases?: ProblemTestCaseDto[];
}
