import { Module } from "@nestjs/common";
import { InterviewSessionController } from "./interview-session.controller";
import { InterviewSessionSeedService } from "./interview-session-seed.service";
import { InterviewSessionService } from "./interview-session.service";

@Module({
  controllers: [InterviewSessionController],
  providers: [InterviewSessionService, InterviewSessionSeedService],
  exports: [InterviewSessionService],
})
export class InterviewSessionModule {}
