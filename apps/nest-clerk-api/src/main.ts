import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { config } from "dotenv";
import { AppModule } from "./app.module";

config({
  path: [".env", ".env.production", ".env.local"],
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
