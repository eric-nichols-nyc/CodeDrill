import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from "class-validator";

const difficulties = ["easy", "medium", "hard"] as const;

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

  /** Optional YouTube walkthrough / editorial link */
  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(2048)
  editorial?: string;
}
