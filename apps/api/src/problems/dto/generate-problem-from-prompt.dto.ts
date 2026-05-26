import { Transform } from "class-transformer";
import { IsString, MaxLength, MinLength } from "class-validator";
import { AI_PROBLEM_PROMPT_MAX_LENGTH } from "../problem-generate.constants";

export class GenerateProblemFromPromptDto {
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @MinLength(1)
  @MaxLength(AI_PROBLEM_PROMPT_MAX_LENGTH)
  prompt!: string;
}
