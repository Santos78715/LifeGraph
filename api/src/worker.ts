import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Worker } from 'bullmq';
import { AppModule } from './app.module';
import { JournalConsumer } from './journal/journel.consumer';
import { JournalExtractionJob } from './journal/journel.producer';
import { redisConnection } from './queue/queue.module';
import { QUEUE_NAMES } from './queue/queue.constants';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const consumer = app.get(JournalConsumer);
  const config = app.get(ConfigService);
  const worker = new Worker<JournalExtractionJob>(
    QUEUE_NAMES.JOURNAL_QUEUE,
    (job) => consumer.process(job),
    { connection: redisConnection(config), concurrency: 5 },
  );

  worker.on('completed', (job) => consumer.onCompleted(job));
  worker.on('failed', (job, error) => consumer.onFailed(job, error));
  worker.on('error', (error) => console.error('Journal worker error', error));

  const shutdown = async () => {
    await worker.close();
    await app.close();
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}

void bootstrap();
