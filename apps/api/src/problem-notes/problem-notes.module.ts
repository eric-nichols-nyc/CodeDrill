import { Module } from "@nestjs/common";
import { ProblemsUserGuard } from "../problem-workspace-code/guards/problems-user.guard";
import { ProblemNotesController } from "./problem-notes.controller";
import { ProblemNotesService } from "./problem-notes.service";

@Module({
  controllers: [ProblemNotesController],
  providers: [ProblemNotesService, ProblemsUserGuard],
})
export class ProblemNotesModule {}
