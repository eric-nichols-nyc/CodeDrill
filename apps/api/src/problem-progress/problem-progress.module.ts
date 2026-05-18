import { Module } from "@nestjs/common";
import { ProblemsUserGuard } from "../problem-workspace-code/guards/problems-user.guard";
import { ProblemProgressController } from "./problem-progress.controller";
import { ProblemProgressService } from "./problem-progress.service";

@Module({
  controllers: [ProblemProgressController],
  providers: [ProblemProgressService, ProblemsUserGuard],
})
export class ProblemProgressModule {}
