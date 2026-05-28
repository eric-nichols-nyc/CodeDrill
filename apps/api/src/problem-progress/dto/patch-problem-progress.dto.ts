import { IsBoolean, IsIn, IsOptional } from "class-validator";

/** Body for PATCH — only send fields you want to change. */
export class PatchProblemProgressDto {
  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;

  @IsOptional()
  @IsIn(["not_started", "attempted", "solved"])
  status?: "not_started" | "attempted" | "solved";
}
