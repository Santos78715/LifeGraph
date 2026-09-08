import { Module } from '@nestjs/common';
import { JournalService } from './journal.service';
import { JournalController } from './journal.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { BullModule } from '@nestjs/bullmq';
import { QUEUE_NAMES } from 'src/queue/queue.constants';
import { JournalProducer } from './journel.producer';
import { JournalConsumer } from './journel.consumer';
import { AiModule } from 'src/ai/ai.module';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: QUEUE_NAMES.JOURNAL_QUEUE,
    }),
    AiModule,
  ],
  controllers: [JournalController],
  providers: [JournalService, JournalProducer, JournalConsumer],
  exports: [JournalConsumer],
})
export class JournalModule {}
