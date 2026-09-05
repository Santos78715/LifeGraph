import { Injectable } from '@nestjs/common';
import { CreateEmbeddingDto } from './dto/create-embedding.dto';
import { UpdateEmbeddingDto } from './dto/update-embedding.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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

  create(createEmbeddingDto: CreateEmbeddingDto) {
    return 'This action adds a new embedding';
  }

  async findAll() {
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
      ORDER BY "createdAt" DESC
    `;
  }

  findOne(id: number) {
    return `This action returns a #${id} embedding`;
  }

  update(id: number, updateEmbeddingDto: UpdateEmbeddingDto) {
    return `This action updates a #${id} embedding`;
  }

  remove(id: number) {
    return `This action removes a #${id} embedding`;
  }
}
