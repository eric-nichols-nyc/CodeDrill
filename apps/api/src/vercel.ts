import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import type { Express, Request, Response } from "express";
import express from "express";
import { AppModule } from "./app.module";

let cachedApp: Express | undefined;

async function getExpressApp(): Promise<Express> {
  if (cachedApp) {
    return cachedApp;
  }

  const expressApp = express();
  const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {
    bodyParser: false,
  });

  nestApp.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  await nestApp.init();
  cachedApp = expressApp;
  return cachedApp;
}

export default async function handler(req: Request, res: Response) {
  const app = await getExpressApp();
  return app(req, res);
}
