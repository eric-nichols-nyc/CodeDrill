import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from "class-validator";

const MAX_JOB_DESCRIPTION = 200_000;
const MAX_URL = 2_000;
const MAX_COMPANY = 500;
const MAX_ROLE = 500;
const MAX_SUMMARY = 8_000;
const MAX_SKILL_ITEMS = 64;
const MAX_SKILL_LENGTH = 120;
const MAX_LIST_ITEMS = 48;
const MAX_SHORT_TEXT = 2_000;
const MAX_MUST_PROVE = 32;
const MAX_HIDDEN = 24;
const MAX_ANGLES = 32;
const MAX_LEVEL = 80;

const CONFIDENCE_LEVELS = ["Low", "Medium", "High"] as const;

export class SeniorityLevelDto {
  @IsString()
  @MinLength(1)
  @MaxLength(MAX_LEVEL)
  level!: string;

  @IsIn(CONFIDENCE_LEVELS)
  confidence!: (typeof CONFIDENCE_LEVELS)[number];
}

export class HiddenExpectationDto {
  @IsString()
  @MaxLength(MAX_SHORT_TEXT)
  expectation!: string;

  @IsString()
  @MaxLength(MAX_SHORT_TEXT)
  reason!: string;
}

export class SuggestedQuestionAngleDto {
  @IsString()
  @MaxLength(MAX_SKILL_LENGTH)
  category!: string;

  @IsString()
  @MaxLength(MAX_SHORT_TEXT)
  angle!: string;
}

/** Structured job analysis fields (AI output or user-confirmed save). */
export class JobAnalysisPayloadDto {
  @IsString()
  @MinLength(1)
  @MaxLength(MAX_COMPANY)
  companyName!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(MAX_ROLE)
  roleTitle!: string;

  @IsString()
  @MaxLength(MAX_SUMMARY)
  roleSummary!: string;

  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(MAX_SKILL_ITEMS)
  @IsString({ each: true })
  @MaxLength(MAX_SKILL_LENGTH, { each: true })
  requiredSkills!: string[];

  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(MAX_SKILL_ITEMS)
  @IsString({ each: true })
  @MaxLength(MAX_SKILL_LENGTH, { each: true })
  niceToHaveSkills!: string[];

  @ValidateNested()
  @Type(() => SeniorityLevelDto)
  seniorityLevel!: SeniorityLevelDto;

  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(MAX_LIST_ITEMS)
  @IsString({ each: true })
  @MaxLength(MAX_SKILL_LENGTH, { each: true })
  likelyInterviewCategories!: string[];

  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(MAX_MUST_PROVE)
  @IsString({ each: true })
  @MaxLength(MAX_SHORT_TEXT, { each: true })
  mustProve!: string[];

  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(MAX_HIDDEN)
  @ValidateNested({ each: true })
  @Type(() => HiddenExpectationDto)
  hiddenExpectations!: HiddenExpectationDto[];

  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(MAX_LIST_ITEMS)
  @IsString({ each: true })
  @MaxLength(MAX_SKILL_LENGTH, { each: true })
  interviewSignals!: string[];

  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(MAX_ANGLES)
  @ValidateNested({ each: true })
  @Type(() => SuggestedQuestionAngleDto)
  suggestedQuestionAngles!: SuggestedQuestionAngleDto[];
}

export class GenerateJobAnalysisDto {
  @IsString()
  @MaxLength(MAX_JOB_DESCRIPTION)
  jobDescription!: string;

  @IsOptional()
  @IsString()
  @MaxLength(MAX_URL)
  jobUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(MAX_COMPANY)
  companyName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(MAX_ROLE)
  roleTitle?: string;
}

export class SaveJobAnalysisDto extends JobAnalysisPayloadDto {
  @IsString()
  @MaxLength(MAX_JOB_DESCRIPTION)
  jobDescription!: string;

  @IsOptional()
  @IsString()
  @MaxLength(MAX_URL)
  jobUrl?: string;
}
