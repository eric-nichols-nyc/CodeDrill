import { Module } from "@nestjs/common";
import { ProblemChatController } from "./problem-chat.controller";
import { ProblemChatService } from "./problem-chat.service";

@Module({
  controllers: [ProblemChatController],
  providers: [ProblemChatService],
})
export class ProblemChatModule {}
