import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './application.module';
import * as functions from 'firebase-functions';
import * as express from 'express';
import { Express } from 'express';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

const server: Express = express();

const createNestServer = async (expressInstance: Express) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
    { logger: console },
    // { cors: { origin: true, credentials: true } },
  );
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  return app.init();
};

createNestServer(server);

export const api = functions
  .runWith({ secrets: ['CLIENT_ID'] })
  .https.onRequest(server);
