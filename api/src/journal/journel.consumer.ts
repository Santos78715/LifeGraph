import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import {
  LifeEntityType,
  MemorySourceType,
  MemoryType,
  RelationshipType,
} from 'generated/prisma/client';
import { randomUUID } from 'node:crypto';
import { AiService } from 'src/ai/ai.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { QUEUE_NAMES } from 'src/queue/queue.constants';
import { JournalExtractionJob } from './journel.producer';
import { journalJSONSchema, journalSchema } from './schema.constant';

type Extraction = {
  entities: Array<{ name: string; description: string; type: LifeEntityType }>;
  memories: Array<{ content: string; type: MemoryType }>;
  relationships: Array<{
    sourceEntity: string;
    targetEntity: string;
    type: RelationshipType;
    description: string;
  }>;
};

@Injectable()
export class JournalConsumer {
  private readonly logger = new Logger(JournalConsumer.name);

  constructor(
    private readonly aiService: AiService,
    private readonly prisma: PrismaService,
  ) {}

  async process(job: Job<JournalExtractionJob, unknown, string>) {
    if (job.name !== 'journal_extraction') {
      throw new Error(`Unsupported journal job: ${job.name}`);
    }

    const extraction = (await this.aiService.aiInteraction(
      { content: job.data.content },
      journalJSONSchema,
      journalSchema,
    )) as Extraction;
    const memories = await this.persistExtraction(job.data, extraction);
    await this.createMemoryEmbeddings(job.data.userId, memories);

    return {
      journalEntryId: job.data.journalEntryId,
      entityCount: extraction.entities.length,
      memoryCount: memories.length,
      relationshipCount: extraction.relationships.length,
    };
  }

  /** Persists within process so errors fail and retry the BullMQ job. */
  private async persistExtraction(
    job: JournalExtractionJob,
    extraction: Extraction,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const journal = await tx.journalEntry.findFirst({
        where: { id: job.journalEntryId, userId: job.userId },
        select: { id: true },
      });
      if (!journal)
        throw new Error(
          `Journal entry ${job.journalEntryId} does not belong to this job user`,
        );

      const entityIds = new Map<string, string>();
      for (const entity of extraction.entities) {
        const name = entity.name.trim();
        if (!name) continue;
        const stored = await tx.lifeEntity.upsert({
          where: {
            userId_type_name: { userId: job.userId, type: entity.type, name },
          },
          create: {
            userId: job.userId,
            type: entity.type,
            name,
            description: entity.description.trim() || null,
          },
          update: { description: entity.description.trim() || undefined },
        });
        entityIds.set(this.entityKey(name), stored.id);
      }

      const resolveEntity = async (name: string) => {
        const key = this.entityKey(name);
        const knownId = entityIds.get(key);
        if (knownId) return knownId;
        const existing = await tx.lifeEntity.findFirst({
          where: {
            userId: job.userId,
            name: { equals: name.trim(), mode: 'insensitive' },
          },
          select: { id: true },
        });
        if (existing) {
          entityIds.set(key, existing.id);
          return existing.id;
        }
        const created = await tx.lifeEntity.upsert({
          where: {
            userId_type_name: {
              userId: job.userId,
              type: LifeEntityType.TOPIC,
              name: name.trim(),
            },
          },
          create: {
            userId: job.userId,
            type: LifeEntityType.TOPIC,
            name: name.trim(),
          },
          update: {},
        });
        entityIds.set(key, created.id);
        return created.id;
      };

      for (const relationship of extraction.relationships) {
        const sourceEntityId = await resolveEntity(relationship.sourceEntity);
        const targetEntityId = await resolveEntity(relationship.targetEntity);
        if (sourceEntityId === targetEntityId) continue;
        await tx.entityRelationship.upsert({
          where: {
            userId_sourceEntityId_targetEntityId_relationshipType: {
              userId: job.userId,
              sourceEntityId,
              targetEntityId,
              relationshipType: relationship.type,
            },
          },
          create: {
            userId: job.userId,
            sourceEntityId,
            targetEntityId,
            relationshipType: relationship.type,
            metadata: { description: relationship.description.trim() },
          },
          update: {
            metadata: { description: relationship.description.trim() },
          },
        });
      }

      const memories: Array<{ id: string; content: string }> = [];
      for (const memory of extraction.memories) {
        const content = memory.content.trim();
        if (!content) continue;
        const stored = await tx.memory.upsert({
          where: {
            sourceType_sourceId_content: {
              sourceType: MemorySourceType.JOURNAL_ENTRY,
              sourceId: job.journalEntryId,
              content,
            },
          },
          create: {
            userId: job.userId,
            type: memory.type,
            content,
            sourceType: MemorySourceType.JOURNAL_ENTRY,
            sourceId: job.journalEntryId,
          },
          update: { type: memory.type },
          select: { id: true, content: true },
        });
        memories.push(stored);
      }
      return memories;
    });
  }

  private async createMemoryEmbeddings(
    userId: string,
    memories: Array<{ id: string; content: string }>,
  ) {
    if (!memories.length) return;
    const response = await this.aiService.createEmbeddings(
      memories.map(({ content }) => content),
    );
    const vectors = response.embeddings?.map((embedding) => embedding.values);
    if (
      !vectors ||
      vectors.length !== memories.length ||
      vectors.some((vector) => !vector?.length)
    ) {
      throw new Error(
        'Embedding provider returned an invalid number of vectors',
      );
    }
    await Promise.all(
      memories.map((memory, index) =>
        this.upsertEmbedding(userId, memory, vectors[index]!),
      ),
    );
  }

  private async upsertEmbedding(
    userId: string,
    memory: { id: string; content: string },
    vector: number[],
  ) {
    const serializedVector = `[${vector.join(',')}]`;
    await this.prisma.$executeRaw`
      INSERT INTO "Embedding" ("id", "userId", "sourceType", "sourceId", "content", "embedding")
      VALUES (${randomUUID()}, ${userId}, ${MemorySourceType.MEMORY}::"MemorySourceType", ${memory.id}, ${memory.content}, ${serializedVector}::vector)
      ON CONFLICT ("userId", "sourceType", "sourceId")
      DO UPDATE SET "content" = EXCLUDED."content", "embedding" = EXCLUDED."embedding"
    `;
  }

  private entityKey(name: string) {
    return name.trim().toLocaleLowerCase();
  }

  onCompleted(job: Job<JournalExtractionJob>) {
    this.logger.log(
      `Journal extraction completed: job=${job.id}, journal=${job.data.journalEntryId}`,
    );
  }

  onFailed(job: Job<JournalExtractionJob> | undefined, error: Error) {
    this.logger.error(
      `Journal extraction failed: job=${job?.id}, journal=${job?.data.journalEntryId}`,
      error.stack,
    );
  }
}
