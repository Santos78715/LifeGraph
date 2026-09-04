import express = require('express');
import { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp } from './app.config';

let cachedServer: express.Express | undefined;

async function createServer() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: ['error', 'warn', 'log'],
  });

  configureApp(app);
  await app.init();

  return server;
}

export default async function handler(
  request: express.Request,
  response: express.Response,
) {
  cachedServer ??= await createServer();
  return cachedServer(request, response);
}
