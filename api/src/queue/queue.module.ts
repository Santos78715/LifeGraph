import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { URL } from 'node:url';

export function redisConnection(config: ConfigService) {
  const redisUrl = config.get<string>('REDIS_URL');
  if (redisUrl) {
    const url = new URL(redisUrl);
    return {
      host: url.hostname,
      port: Number(url.port || 6379),
      username: url.username || undefined,
      password: url.password || undefined,
      tls: url.protocol === 'rediss:' ? {} : undefined,
      // Required by BullMQ; commands must not be retried indefinitely.
      maxRetriesPerRequest: null,
    };
  }

  const host = config.get<string>('REDIS_HOST');
  if (!host) {
    throw new Error('REDIS_URL or REDIS_HOST must be configured');
  }

  return {
    host,
    port: config.get<number>('REDIS_PORT') ?? 6379,
    password: config.get<string>('REDIS_PASSWORD'),
    maxRetriesPerRequest: null,
  };
}

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: redisConnection(config),
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class QueueModule {}
