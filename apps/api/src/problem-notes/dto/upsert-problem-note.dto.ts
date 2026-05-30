import { IsString, MaxLength } from "class-validator";

const MAX_NOTE_BODY_LENGTH = 65_536;

export class UpsertProblemNoteDto {
  @IsString()
  @MaxLength(MAX_NOTE_BODY_LENGTH)
  body!: string;
}
