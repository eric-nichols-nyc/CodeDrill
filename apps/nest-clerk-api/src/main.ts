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

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  app.setGlobalPrefix("api");

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  const port = Number(process.env.PORT) || 3031;
  await app.listen(port);
}

void bootstrap();
