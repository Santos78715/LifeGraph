import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { QUEUE_NAMES } from 'src/queue/queue.constants';

export type JournalEmbeddingJob = {
  content: string;
  sourceType: string;
  userId: string;
  sourceId: string;
};

@Injectable()
export class JournalProducer {
  constructor(
    @InjectQueue(QUEUE_NAMES.JOURNAL_QUEUE) private journalQueue: Queue,
  ) {}

  async addJob(input: JournalEmbeddingJob): Promise<void> {
    console.log('Adding job to the queue:', input);
    const job = await this.journalQueue.add('journel_services', input, {
      priority: 2,
      attempts: 3,
      removeOnComplete: true,
      removeOnFail: false,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
  }
}
