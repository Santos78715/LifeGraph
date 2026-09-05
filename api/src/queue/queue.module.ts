import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
const config = new ConfigService();

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        port: config.get<number>('REDIS_PORT'),
        host: config.get<string>('REDIS_HOST'),
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class QueueModule {}
