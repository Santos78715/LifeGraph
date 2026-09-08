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

export type JournalExtractionJob = {
  journalEntryId: string;
  userId: string;
  title: string;
  content: string;
};

@Injectable()
export class JournalProducer {
  constructor(
    @InjectQueue(QUEUE_NAMES.JOURNAL_QUEUE) private journalQueue: Queue,
  ) {}

  async addJob(input: JournalExtractionJob): Promise<string> {
    const job = await this.journalQueue.add('journal_extraction', input, {
      // A stable ID prevents duplicate queued work for the same journal entry.
      // BullMQ job IDs may not contain Redis's colon separator.
      jobId: `journal-extraction-${input.journalEntryId}`,
      priority: 2,
      attempts: 3,
      removeOnComplete: true,
      removeOnFail: false,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });

    return String(job.id);
  }
}
