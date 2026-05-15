import { Module } from "@nestjs/common";
import { ProblemsUserGuard } from "./guards/problems-user.guard";
import { ProblemWorkspaceCodeController } from "./problem-workspace-code.controller";
import { ProblemWorkspaceCodeService } from "./problem-workspace-code.service";

@Module({
  controllers: [ProblemWorkspaceCodeController],
  providers: [ProblemWorkspaceCodeService, ProblemsUserGuard],
})
export class ProblemWorkspaceCodeModule {}
