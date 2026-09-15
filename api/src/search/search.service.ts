import { Injectable } from '@nestjs/common';
import { MemorySourceType } from 'generated/prisma/client';
import { AiService } from 'src/ai/ai.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSearchDto } from './dto/create-search.dto';

type RetrievedSource = {
  id: string;
  content: string;
  type: string;
  sourceKind: string;
  importance: number;
  confidence: number;
  createdAt: Date;
  similarity: number;
};

@Injectable()
export class SearchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
  ) {}

  async search(userId: string, input: CreateSearchDto) {
    const embeddingResponse = await this.aiService.createEmbeddings([
      input.query,
    ]);
    const vector = embeddingResponse.embeddings?.[0]?.values;
    if (!vector?.length) {
      throw new Error(
        'Embedding provider returned no vector for the search query',
      );
    }

    const queryVector = `[${vector.join(',')}]`;
    const sources = await this.prisma.$queryRaw<RetrievedSource[]>`
      SELECT * FROM (
        SELECT
          m."id", m."content", m."type"::text AS "type", 'MEMORY' AS "sourceKind",
          m."importance", m."confidence", m."createdAt",
          1 - (e."embedding" <=> ${queryVector}::vector) AS "similarity"
        FROM "Embedding" e
        INNER JOIN "Memory" m ON m."id" = e."sourceId"
        WHERE e."userId" = ${userId}
          AND e."sourceType" = ${MemorySourceType.MEMORY}::"MemorySourceType"
          AND m."userId" = ${userId}

        UNION ALL

        SELECT
          c."id", c."content", 'DOCUMENT_CHUNK' AS "type", 'DOCUMENT' AS "sourceKind",
          0.5::double precision AS "importance", 1.0::double precision AS "confidence", d."createdAt",
          1 - (e."embedding" <=> ${queryVector}::vector) AS "similarity"
        FROM "Embedding" e
        INNER JOIN "DocumentChunk" c ON c."id" = e."sourceId"
        INNER JOIN "Document" d ON d."id" = c."documentId"
        WHERE e."userId" = ${userId}
          AND e."sourceType" = ${MemorySourceType.DOCUMENT_CHUNK}::"MemorySourceType"
          AND d."userId" = ${userId}
          AND d."status" = 'READY'::"DocumentStatus"
      ) AS "sources"
      ORDER BY "similarity" DESC
      LIMIT ${input.limit}
    `;

    if (!sources.length) {
      return {
        answer: 'I do not have any relevant saved memories yet.',
        sources: [],
      };
    }

    const context = sources
      .map(
        (source, index) =>
          `[${index + 1}] (${source.sourceKind}) ${source.content}`,
      )
      .join('\n');
    const answer = await this.aiService.answerWithContext(input.query, context);

    return {
      answer,
      sources: sources.map((source, index) => ({
        number: index + 1,
        id: source.id,
        kind: source.sourceKind,
        content: source.content,
        type: source.type,
        similarity: Number(source.similarity),
        importance: Number(source.importance),
        confidence: Number(source.confidence),
        createdAt: source.createdAt,
      })),
    };
  }
}
