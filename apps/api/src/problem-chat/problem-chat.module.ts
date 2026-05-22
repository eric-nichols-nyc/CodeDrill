import { Module } from "@nestjs/common";
import { ProblemsModule } from "../problems/problems.module";
import { ProblemChatController } from "./problem-chat.controller";
import { ProblemChatService } from "./problem-chat.service";

@Module({
  imports: [ProblemsModule],
  controllers: [ProblemChatController],
  providers: [ProblemChatService],
})
export class ProblemChatModule {}
