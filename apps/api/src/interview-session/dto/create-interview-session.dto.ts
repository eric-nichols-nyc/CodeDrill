import { Type } from "class-transformer";
import { IsUUID, ValidateNested } from "class-validator";
import { InterviewBlueprintPayloadDto } from "./interview-blueprint-payload.dto";

export class CreateInterviewSessionDto {
  @IsUUID()
  profileId!: string;

  @IsUUID()
  jobAnalysisId!: string;

  @ValidateNested()
  @Type(() => InterviewBlueprintPayloadDto)
  blueprint!: InterviewBlueprintPayloadDto;
}
