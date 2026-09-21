import { Injectable, NotFoundException } from '@nestjs/common';
import { MemorySourceType } from 'generated/prisma/client';
import { randomUUID } from 'node:crypto';
import { AiService } from '../ai/ai.service';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { UpdateMemoryDto } from './dto/update-memory.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MemoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
  ) {}

  async create(userId: string, createMemoryDto: CreateMemoryDto) {
    const memory = await this.prisma.memory.create({
      data: { ...createMemoryDto, userId },
    });
    await this.upsertEmbedding(userId, memory.id, memory.content);
    return memory;
  }

  findAll(userId: string) {
    return this.prisma.memory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const memory = await this.prisma.memory.findFirst({
      where: { id, userId },
    });
    if (!memory) {
      throw new NotFoundException(`Memory ${id} not found`);
    }
    return memory;
  }

  async update(userId: string, id: string, updateMemoryDto: UpdateMemoryDto) {
    const existing = await this.findOne(userId, id);
    const memory = await this.prisma.memory.update({
      where: { id },
      data: updateMemoryDto,
    });
    if (updateMemoryDto.content && updateMemoryDto.content !== existing.content) {
      await this.upsertEmbedding(userId, id, memory.content);
    }
    return memory;
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.$transaction([
      this.prisma.$executeRaw`DELETE FROM "Embedding" WHERE "userId" = ${userId} AND "sourceType" = ${MemorySourceType.MEMORY}::"MemorySourceType" AND "sourceId" = ${id}`,
      this.prisma.memory.delete({ where: { id } }),
    ]);
    return { message: `Memory ${id} has been deleted` };
  }

  private async upsertEmbedding(userId: string, sourceId: string, content: string) {
    const response = await this.aiService.createEmbeddings([content]);
    const vector = response.embeddings?.[0]?.values;
    if (!vector?.length) {
      throw new Error('Embedding provider returned no vector for the memory');
    }
    const serializedVector = `[${vector.join(',')}]`;
    await this.prisma.$executeRaw`
      INSERT INTO "Embedding" ("id", "userId", "sourceType", "sourceId", "content", "embedding", "metadata")
      VALUES (${randomUUID()}, ${userId}, ${MemorySourceType.MEMORY}::"MemorySourceType", ${sourceId}, ${content}, ${serializedVector}::vector, ${JSON.stringify({ model: 'gemini-embedding-2', dimensions: vector.length })}::jsonb)
      ON CONFLICT ("userId", "sourceType", "sourceId")
      DO UPDATE SET "content" = EXCLUDED."content", "embedding" = EXCLUDED."embedding", "metadata" = EXCLUDED."metadata"
    `;
  }
}
