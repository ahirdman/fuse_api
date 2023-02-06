import { NestFactory } from '@nestjs/core';
import { AppModule } from './application.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as functions from 'firebase-functions';
import { Express } from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const corsOptions: CorsOptions = {
  origin: true,
  credentials: true,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: corsOptions });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(8080);
}

async function createNestServer(expressInstance: Express) {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
    { cors: corsOptions },
  );
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  return app.init();
}

export let api: null | functions.HttpsFunction = null;

if (
  process.env.NODE_ENV === 'emulator' ||
  process.env.NODE_ENV === 'production'
) {
  console.log('Starting Emulator Server');
  const server: Express = express();

  createNestServer(server);

  api = functions.runWith({ secrets: ['CLIENT_ID'] }).https.onRequest(server);
} else {
  console.log('Starting Local Server');
  bootstrap();
}
