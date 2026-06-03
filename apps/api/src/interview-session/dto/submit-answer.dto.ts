import { IsIn, IsInt, IsOptional, IsString, Min, MinLength } from "class-validator";

export class SubmitAnswerDto {
  @IsString()
  @MinLength(1)
  transcript!: string;

  @IsIn(["voice", "text"])
  answerMode!: "voice" | "text";

  @IsOptional()
  @IsInt()
  @Min(0)
  durationSeconds?: number;
}
