import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type EmbeddingRow = {
  id: string;
  userId: string;
  sourceType: string;
  sourceId: string;
  content: string;
  embedding: string;
  metadata: unknown;
  createdAt: Date;
};

@Injectable()
export class EmbeddingService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.$queryRaw<EmbeddingRow[]>`
      SELECT
        "id",
        "userId",
        "sourceType",
        "sourceId",
        "content",
        "embedding"::text AS "embedding",
        "metadata",
        "createdAt"
      FROM "Embedding"
      WHERE "userId" = ${userId}
      ORDER BY "createdAt" DESC
    `;
  }

  async findOne(userId: string, id: string) {
    const rows = await this.prisma.$queryRaw<EmbeddingRow[]>`
      SELECT
        "id",
        "userId",
        "sourceType",
        "sourceId",
        "content",
        "embedding"::text AS "embedding",
        "metadata",
        "createdAt"
      FROM "Embedding"
      WHERE "id" = ${id} AND "userId" = ${userId}
      LIMIT 1
    `;
    if (!rows.length) {
      throw new NotFoundException(`Embedding ${id} not found`);
    }
    return rows[0];
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.$executeRaw`
      DELETE FROM "Embedding" WHERE "id" = ${id} AND "userId" = ${userId}
    `;
    return { message: `Embedding ${id} has been deleted` };
  }
}
