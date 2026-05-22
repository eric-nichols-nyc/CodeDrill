import { Module } from "@nestjs/common";
import { ProblemsAccessGuard } from "./guards/problems-access.guard";
import { ProblemsController } from "./problems.controller";
import { ProblemsService } from "./problems.service";

@Module({
  controllers: [ProblemsController],
  providers: [ProblemsService, ProblemsAccessGuard],
  exports: [ProblemsService],
})
export class ProblemsModule {}
