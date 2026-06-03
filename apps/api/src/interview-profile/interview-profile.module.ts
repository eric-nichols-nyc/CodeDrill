import { Module } from "@nestjs/common";
import { ProblemsUserGuard } from "../problem-workspace-code/guards/problems-user.guard";
import { InterviewProfileController } from "./interview-profile.controller";
import { InterviewProfileGenerateService } from "./interview-profile-generate.service";
import { InterviewProfileService } from "./interview-profile.service";

@Module({
  controllers: [InterviewProfileController],
  providers: [
    InterviewProfileService,
    InterviewProfileGenerateService,
    ProblemsUserGuard,
  ],
})
export class InterviewProfileModule {}
