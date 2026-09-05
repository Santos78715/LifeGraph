import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QUEUE_NAMES } from 'src/queue/queue.constants';
import { Job } from 'bullmq';
import { AiService } from 'src/ai/ai.service';
import { JournalEmbeddingJob } from './journel.producer';
import { MemorySourceType } from 'generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';

@Processor(QUEUE_NAMES.JOURNAL_QUEUE)
export class JournalConsumer extends WorkerHost {
  constructor(
    private readonly aiService: AiService,
    private prisma: PrismaService,
  ) {
    super();
  }

  async process(job: Job<JournalEmbeddingJob>): Promise<any> {
    const response = await this.aiService.createEmbeddings(job.data.content);
    const embedding = response?.embeddings?.[0]?.values;
    const result = await this.prisma.$executeRaw`
  INSERT INTO "Embedding" ("id", "userId", "sourceType", "sourceId", "content", "embedding", "createdAt")
  VALUES (
    gen_random_uuid(),
    ${job.data.userId},
    ${MemorySourceType.JOURNAL_ENTRY}::"MemorySourceType",
    ${job.data.sourceId},
    ${job.data.content},
    ${`[${embedding.join(',')}]`}::vector,
    now()
  )
`;

    console.log('Embedding Result', result);
  }
}
