import { IsString, MinLength } from "class-validator";

export class UpsertWorkspaceCodeDto {
  @IsString()
  @MinLength(1)
  language!: string;

  @IsString()
  code!: string;
}
