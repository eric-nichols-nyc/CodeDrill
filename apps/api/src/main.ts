import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { config } from "dotenv";
import { AppModule } from "./app.module";
import { validateEnv } from "./config/env";

config({
  path: [".env", ".env.production", ".env.local"],
});

async function bootstrap() {
  validateEnv();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useBodyParser("json", { limit: "2mb" });
  app.useBodyParser("urlencoded", { limit: "2mb", extended: true });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  const port = Number(process.env.PORT) || 3030;
  await app.listen(port);
}

void bootstrap();
