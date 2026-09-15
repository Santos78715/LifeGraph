import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentStatus, MemorySourceType } from 'generated/prisma/client';
import { randomUUID } from 'node:crypto';
import { AiService } from 'src/ai/ai.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';

const CHUNK_SIZE = 1_200;
const CHUNK_OVERLAP = 200;
const EMBEDDING_BATCH_SIZE = 50;

@Injectable()
export class DocumentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
  ) {}

  async create(userId: string, input: CreateDocumentDto) {
    const chunks = this.chunkText(input.content);
    const document = await this.prisma.document.create({
      data: {
        userId,
        name: input.name.trim(),
        mimeType: input.mimeType,
        // Text is persisted in DocumentChunk rows. Binary document storage belongs
        // in an object-store adapter, not the ephemeral API filesystem.
        storageKey: `inline://${randomUUID()}`,
        status: DocumentStatus.PROCESSING,
        chunks: {
          create: chunks.map((content, chunkIndex) => ({
            content,
            chunkIndex,
          })),
        },
      },
      include: { chunks: { orderBy: { chunkIndex: 'asc' } } },
    });

    try {
      await this.embedChunks(userId, document.chunks);
      return await this.prisma.document.update({
        where: { id: document.id },
        data: { status: DocumentStatus.READY },
        include: { _count: { select: { chunks: true } } },
      });
    } catch (error) {
      await this.prisma.document.update({
        where: { id: document.id },
        data: { status: DocumentStatus.FAILED },
      });
      throw error;
    }
  }

  findAll(userId: string) {
    return this.prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { chunks: true } } },
    });
  }

  async findOne(userId: string, id: string) {
    const document = await this.prisma.document.findFirst({
      where: { id, userId },
      include: { chunks: { orderBy: { chunkIndex: 'asc' } } },
    });
    if (!document) throw new NotFoundException(`Document ${id} not found`);
    return document;
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.document.delete({ where: { id } });
    return { message: `Document ${id} has been deleted` };
  }

  async analyze(userId: string, id: string) {
    const document = await this.findOne(userId, id);
    if (document.status !== DocumentStatus.READY) {
      throw new Error(`Document ${id} is not ready for analysis`);
    }

    // Keep requests bounded even for the largest accepted document. The entire
    // document remains retrievable through RAG; this endpoint is for overview.
    const context = document.chunks
      .slice(0, 12)
      .map((chunk) => `[${chunk.chunkIndex + 1}] ${chunk.content}`)
      .join('\n\n');
    const analysis = await this.aiService.generateText(
      `Document name: ${document.name}\n\nDocument excerpts:\n${context}`,
      'Provide a concise, factual analysis of the supplied document. Include: a summary, key facts, decisions or action items, and unanswered questions. Do not use information outside the excerpts.',
    );
    return { documentId: document.id, analysis };
  }

  private async embedChunks(
    userId: string,
    chunks: Array<{ id: string; content: string }>,
  ) {
    for (let start = 0; start < chunks.length; start += EMBEDDING_BATCH_SIZE) {
      const batch = chunks.slice(start, start + EMBEDDING_BATCH_SIZE);
      const response = await this.aiService.createEmbeddings(
        batch.map((chunk) => chunk.content),
      );
      const vectors = response.embeddings?.map((embedding) => embedding.values);
      if (
        !vectors ||
        vectors.length !== batch.length ||
        vectors.some((vector) => !vector?.length)
      ) {
        throw new Error('Embedding provider returned invalid document vectors');
      }
      await Promise.all(
        batch.map((chunk, index) =>
          this.upsertEmbedding(userId, chunk, vectors[index]!),
        ),
      );
    }
  }

  private async upsertEmbedding(
    userId: string,
    chunk: { id: string; content: string },
    vector: number[],
  ) {
    const serializedVector = `[${vector.join(',')}]`;
    await this.prisma.$executeRaw`
      INSERT INTO "Embedding" ("id", "userId", "sourceType", "sourceId", "content", "embedding", "metadata")
      VALUES (${randomUUID()}, ${userId}, ${MemorySourceType.DOCUMENT_CHUNK}::"MemorySourceType", ${chunk.id}, ${chunk.content}, ${serializedVector}::vector, ${JSON.stringify({ model: 'gemini-embedding-2', dimensions: 768 })}::jsonb)
      ON CONFLICT ("userId", "sourceType", "sourceId")
      DO UPDATE SET "content" = EXCLUDED."content", "embedding" = EXCLUDED."embedding", "metadata" = EXCLUDED."metadata"
    `;
  }

  private chunkText(text: string) {
    const normalized = text.replace(/\s+/g, ' ').trim();
    const chunks: string[] = [];
    for (
      let start = 0;
      start < normalized.length;
      start += CHUNK_SIZE - CHUNK_OVERLAP
    ) {
      const end = Math.min(start + CHUNK_SIZE, normalized.length);
      let chunk = normalized.slice(start, end);
      if (end < normalized.length) {
        const boundary = chunk.lastIndexOf(' ');
        if (boundary > CHUNK_SIZE / 2) chunk = chunk.slice(0, boundary);
      }
      if (chunk) chunks.push(chunk);
      if (end === normalized.length) break;
    }
    return chunks;
  }
}
