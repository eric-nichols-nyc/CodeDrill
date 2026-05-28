import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { MeController } from "./me.controller";
import { UsersModule } from "./users/users.module";
import { WebhooksModule } from "./webhooks/webhooks.module";

@Module({
  imports: [DatabaseModule, AuthModule, UsersModule, WebhooksModule],
  controllers: [AppController, MeController],
  providers: [AppService],
})
export class AppModule {}
