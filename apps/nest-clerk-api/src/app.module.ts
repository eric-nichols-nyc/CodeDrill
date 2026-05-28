import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { MeController } from "./me.controller";

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [AppController, MeController],
  providers: [AppService],
})
export class AppModule {}
