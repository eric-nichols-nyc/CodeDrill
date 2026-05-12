import { Transform } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";

export class ListProblemsQueryDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === "") {
      return;
    }
    return value === true || value === "true";
  })
  @IsBoolean()
  published?: boolean;
}
