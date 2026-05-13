import { IsObject, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class PostProblemChatMessageDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200_000)
  content!: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
