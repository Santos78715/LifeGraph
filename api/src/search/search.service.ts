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
    console.log('Search started');

    // 1. Generate embedding for the user's query
    const embeddingResponse = await this.aiService.createEmbeddings([
      input.query,
    ]);

    const vector = embeddingResponse.embeddings?.[0]?.values;

    if (!vector?.length) {
      throw new Error(
        'Embedding provider returned no vector for the search query',
      );
    }

    console.log('Embedding vector length:', vector.length);

    // 2. Convert the JS number[] into pgvector string format
    //
    // Example:
    // [0.123, 0.456, 0.789]
    //
    // becomes:
    // "[0.123,0.456,0.789]"
    const queryVector = `[${vector.join(',')}]`;

    let sources: RetrievedSource[];

    try {
      // 3. Search memories and document chunks using cosine distance
      sources = await this.prisma.$queryRaw<RetrievedSource[]>`
        SELECT *
        FROM (
          SELECT
            m."id",
            m."content",
            m."type"::text AS "type",
            'MEMORY'::text AS "sourceKind",
            m."importance"::double precision AS "importance",
            m."confidence"::double precision AS "confidence",
            m."createdAt",
            1 - (
              e."embedding" <=> ${queryVector}::vector
            ) AS "similarity"

          FROM "Embedding" e

          INNER JOIN "Memory" m
            ON m."id" = e."sourceId"

          WHERE e."userId" = ${userId}
            AND e."sourceType" =
              ${MemorySourceType.MEMORY}::"MemorySourceType"
            AND m."userId" = ${userId}


          UNION ALL


          SELECT
            c."id",
            c."content",
            'DOCUMENT_CHUNK'::text AS "type",
            'DOCUMENT'::text AS "sourceKind",
            0.5::double precision AS "importance",
            1.0::double precision AS "confidence",
            d."createdAt",
            1 - (
              e."embedding" <=> ${queryVector}::vector
            ) AS "similarity"

          FROM "Embedding" e

          INNER JOIN "DocumentChunk" c
            ON c."id" = e."sourceId"

          INNER JOIN "Document" d
            ON d."id" = c."documentId"

          WHERE e."userId" = ${userId}
            AND e."sourceType" =
              ${MemorySourceType.DOCUMENT_CHUNK}::"MemorySourceType"
            AND d."userId" = ${userId}
            AND d."status" = 'READY'::"DocumentStatus"
        ) AS sources

        ORDER BY "similarity" DESC

        LIMIT ${input.limit}
      `;
    } catch (error) {
      console.error('========================================');
      console.error('DATABASE SEARCH ERROR');
      console.error('========================================');
      console.error(error);
      console.error('========================================');

      throw error;
    }

    console.log('Sources found:', sources.length);

    // 4. No relevant sources
    if (!sources.length) {
      return {
        answer: 'I do not have any relevant saved memories yet.',
        sources: [],
      };
    }

    // 5. Build context for the AI
    const context = sources
      .map(
        (source, index) =>
          `[${index + 1}] (${source.sourceKind}) ${source.content}`,
      )
      .join('\n');

    console.log('Context:', context);

    // 6. Ask AI to answer using retrieved context
    const answer = await this.aiService.answerWithContext(input.query, context);

    // 7. Return answer + sources
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
