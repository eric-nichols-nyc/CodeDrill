import { Global, Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ClerkAuthGuard } from "./clerk-auth.guard";
import { ClerkService } from "./clerk.service";

@Global()
@Module({
  providers: [
    ClerkService,
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard,
    },
  ],
  exports: [ClerkService],
})
export class AuthModule {}
