import 'reflect-metadata';
import { register } from 'tsconfig-paths';
import { resolve } from 'path';
register({
  baseUrl: resolve(__dirname, '..'),
  paths: { '@/*': ['src/*'] },
});
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import express from 'express';
import type { Request, Response } from 'express';

let cachedApp: express.Express | null = null;

async function bootstrap(): Promise<express.Express> {
  const expressApp = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    { logger: ['error', 'warn'] },
  );

  app.use(helmet());

  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.init();
  return expressApp;
}

export default async function handler(req: Request, res: Response) {
  if (!cachedApp) {
    cachedApp = await bootstrap();
  }
  cachedApp(req, res);
}
