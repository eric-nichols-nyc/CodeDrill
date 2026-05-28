import { Module } from "@nestjs/common";
import { ProblemsModule } from "../problems/problems.module";
import { ProblemsUserGuard } from "../problem-workspace-code/guards/problems-user.guard";
import { ProblemChatController } from "./problem-chat.controller";
import { ProblemChatService } from "./problem-chat.service";

@Module({
  imports: [ProblemsModule],
  controllers: [ProblemChatController],
  providers: [ProblemChatService, ProblemsUserGuard],
})
export class ProblemChatModule {}
