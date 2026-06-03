import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { InterviewJobAnalysisModule } from "./interview-job-analysis/interview-job-analysis.module";
import { InterviewProfileModule } from "./interview-profile/interview-profile.module";
import { ProblemChatModule } from "./problem-chat/problem-chat.module";
import { ProblemNotesModule } from "./problem-notes/problem-notes.module";
import { ProblemProgressModule } from "./problem-progress/problem-progress.module";
import { ProblemWorkspaceCodeModule } from "./problem-workspace-code/problem-workspace-code.module";
import { ProblemsModule } from "./problems/problems.module";
import { SessionController } from "./session.controller";

@Module({
  imports: [
    DatabaseModule,
    InterviewProfileModule,
    InterviewJobAnalysisModule,
    ProblemChatModule,
    ProblemNotesModule,
    ProblemProgressModule,
    ProblemWorkspaceCodeModule,
    ProblemsModule,
  ],
  controllers: [AppController, SessionController],
  providers: [AppService],
})
export class AppModule {}
