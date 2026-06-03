import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from "class-validator";

const MAX_TITLE = 500;
const MAX_CATEGORY = 120;
const MAX_DIFFICULTY = 80;
const MAX_QUESTION = 4_000;
const MAX_SIGNAL = 500;
const MAX_FOLLOW_UP = 500;
const MAX_CATEGORIES = 12;
const MAX_QUESTIONS = 10;
const MIN_QUESTIONS = 5;

export class BlueprintQuestionDto {
  @IsInt()
  @Min(1)
  @Max(MAX_QUESTIONS)
  order!: number;

  @IsString()
  @MinLength(1)
  @MaxLength(MAX_CATEGORY)
  category!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(MAX_DIFFICULTY)
  difficulty!: string;

  @IsString()
  @MinLength(10)
  @MaxLength(MAX_QUESTION)
  question!: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(8)
  @IsString({ each: true })
  @MaxLength(MAX_SIGNAL, { each: true })
  expectedSignals!: string[];

  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(6)
  @IsString({ each: true })
  @MaxLength(MAX_FOLLOW_UP, { each: true })
  followUpOpportunities!: string[];
}

/** AI output or client-confirmed blueprint (no DB ids on questions). */
export class InterviewBlueprintPayloadDto {
  @IsString()
  @MinLength(1)
  @MaxLength(MAX_TITLE)
  interviewTitle!: string;

  @IsInt()
  @Min(15)
  @Max(90)
  estimatedDurationMinutes!: number;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(MAX_CATEGORIES)
  @IsString({ each: true })
  @MaxLength(MAX_CATEGORY, { each: true })
  categories!: string[];

  @IsArray()
  @ArrayMinSize(MIN_QUESTIONS)
  @ArrayMaxSize(MAX_QUESTIONS)
  @ValidateNested({ each: true })
  @Type(() => BlueprintQuestionDto)
  questions!: BlueprintQuestionDto[];
}
