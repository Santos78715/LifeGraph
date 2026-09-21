import express = require('express');
import { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { configureApp } from './app.config';

let cachedServer: express.Express | undefined;

async function createServer() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: ['error', 'warn', 'log'],
  });

  configureApp(app);

  const config = new DocumentBuilder()
    .setTitle('LifeGraph API')
    .setDescription(
      'LifeGraph — a personal knowledge graph and AI-powered life journal API.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

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
