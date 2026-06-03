import { Module } from "@nestjs/common";
import { InterviewSessionController } from "./interview-session.controller";
import { InterviewSessionGenerateService } from "./interview-session-generate.service";
import { InterviewSessionPersistService } from "./interview-session-persist.service";
import { InterviewSessionSeedService } from "./interview-session-seed.service";
import { InterviewSessionService } from "./interview-session.service";

@Module({
  controllers: [InterviewSessionController],
  providers: [
    InterviewSessionService,
    InterviewSessionSeedService,
    InterviewSessionGenerateService,
    InterviewSessionPersistService,
  ],
  exports: [InterviewSessionService],
})
export class InterviewSessionModule {}
