import { Module } from "@nestjs/common";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { auth } from "./auth";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { ProblemChatModule } from "./problem-chat/problem-chat.module";
import { ProblemProgressModule } from "./problem-progress/problem-progress.module";
import { ProblemWorkspaceCodeModule } from "./problem-workspace-code/problem-workspace-code.module";
import { ProblemsModule } from "./problems/problems.module";
import { SessionController } from "./session.controller";

@Module({
  imports: [
    DatabaseModule,
    ProblemChatModule,
    ProblemProgressModule,
    ProblemWorkspaceCodeModule,
    ProblemsModule,
    AuthModule.forRoot({
      auth,
      bodyParser: {
        json: { limit: "2mb" },
        urlencoded: { limit: "2mb", extended: true },
      },
    }),
  ],
  controllers: [AppController, SessionController],
  providers: [AppService],
})
export class AppModule {}
