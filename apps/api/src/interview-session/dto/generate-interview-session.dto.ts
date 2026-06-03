import { IsOptional, IsUUID } from "class-validator";

/** Optional explicit inputs; defaults to latest profile + job analysis for user. */
export class GenerateInterviewSessionDto {
  @IsOptional()
  @IsUUID()
  profileId?: string;

  @IsOptional()
  @IsUUID()
  jobAnalysisId?: string;
}
