import { Module } from "@nestjs/common";
import { ProblemsUserGuard } from "../problem-workspace-code/guards/problems-user.guard";
import { InterviewJobAnalysisController } from "./interview-job-analysis.controller";
import { InterviewJobAnalysisGenerateService } from "./interview-job-analysis-generate.service";
import { InterviewJobAnalysisService } from "./interview-job-analysis.service";

@Module({
  controllers: [InterviewJobAnalysisController],
  providers: [
    InterviewJobAnalysisService,
    InterviewJobAnalysisGenerateService,
    ProblemsUserGuard,
  ],
})
export class InterviewJobAnalysisModule {}
