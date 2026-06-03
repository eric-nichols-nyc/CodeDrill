import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";

const MAX_RESUME_TEXT = 200_000;
const MAX_SUMMARY = 8_000;
const MAX_SKILL_ITEMS = 64;
const MAX_SKILL_LENGTH = 120;
const MAX_PROJECTS = 32;
const MAX_CLAIMS = 64;
const MAX_LIST_ITEMS = 48;
const MAX_SHORT_TEXT = 2_000;

export class ProjectExperienceDto {
  @IsString()
  @MaxLength(500)
  name!: string;

  @IsString()
  @MaxLength(500)
  role!: string;

  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(32)
  @IsString({ each: true })
  @MaxLength(MAX_SHORT_TEXT, { each: true })
  claims!: string[];
}

export class ResumeClaimDto {
  @IsString()
  @MaxLength(MAX_SHORT_TEXT)
  claim!: string;

  @IsString()
  @MaxLength(MAX_SHORT_TEXT)
  questionAngle!: string;
}

/** Structured profile fields (AI output or user edit). */
export class ProfilePayloadDto {
  @IsString()
  @MaxLength(MAX_SUMMARY)
  summary!: string;

  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(MAX_SKILL_ITEMS)
  @IsString({ each: true })
  @MaxLength(MAX_SKILL_LENGTH, { each: true })
  coreSkills!: string[];

  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(MAX_PROJECTS)
  @ValidateNested({ each: true })
  @Type(() => ProjectExperienceDto)
  projects!: ProjectExperienceDto[];

  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(MAX_CLAIMS)
  @ValidateNested({ each: true })
  @Type(() => ResumeClaimDto)
  claimsToVerify!: ResumeClaimDto[];

  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(MAX_LIST_ITEMS)
  @IsString({ each: true })
  @MaxLength(MAX_SKILL_LENGTH, { each: true })
  strengthAreas!: string[];

  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(MAX_LIST_ITEMS)
  @IsString({ each: true })
  @MaxLength(MAX_SKILL_LENGTH, { each: true })
  potentialGapAreas!: string[];
}

export class GenerateProfileDto {
  @IsString()
  @MaxLength(MAX_RESUME_TEXT)
  resumeText!: string;
}

export class SaveProfileDto extends ProfilePayloadDto {
  @IsString()
  @MaxLength(MAX_RESUME_TEXT)
  resumeText!: string;
}

export class UpdateProfileDto extends ProfilePayloadDto {}
