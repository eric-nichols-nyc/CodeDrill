import { Module } from "@nestjs/common";
import { ProblemsAccessGuard } from "./guards/problems-access.guard";
import { ProblemGenerateService } from "./problem-generate.service";
import { ProblemsController } from "./problems.controller";
import { ProblemsService } from "./problems.service";

@Module({
  controllers: [ProblemsController],
  providers: [ProblemsService, ProblemGenerateService, ProblemsAccessGuard],
  exports: [ProblemsService],
})
export class ProblemsModule {}
