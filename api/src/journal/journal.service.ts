import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJournalDto } from './dto/create-journal.dto';
import { UpdateJournalDto } from './dto/update-journal.dto';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { JournalProducer } from './journel.producer';

@Injectable()
export class JournalService {
  constructor(
    private prisma: PrismaService,
    private journel: JournalProducer,
  ) {}

  async create(userId: string, createJournalDto: CreateJournalDto) {
    const journal = await this.prisma.journalEntry.create({
      data: { ...createJournalDto, userId },
    });
    const jobId = await this.journel.addJob({
      journalEntryId: journal.id,
      userId: journal.userId,
      title: createJournalDto.title,
      content: createJournalDto.content,
    });

    return { journal, jobId };
  }

  findAll(userId: string) {
    return this.prisma.journalEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const journal = await this.prisma.journalEntry.findFirst({
      where: { id, userId },
    });

    if (!journal) {
      throw new NotFoundException(`Journal entry ${id} not found`);
    }

    return journal;
  }

  async update(userId: string, id: string, updateJournalDto: UpdateJournalDto) {
    await this.findOne(userId, id);
    const journal = await this.prisma.journalEntry.update({
      where: { id },
      data: updateJournalDto,
    });
    if (updateJournalDto.content !== undefined || updateJournalDto.title !== undefined) {
      await this.clearExtraction(userId, id);
      await this.journel.addJob({
        journalEntryId: journal.id,
        userId,
        title: journal.title,
        content: journal.content,
      });
    }
    return journal;
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.clearExtraction(userId, id);
    await this.prisma.journalEntry.delete({ where: { id } });
    return { message: `Journal entry ${id} has been deleted` };
  }

  private async clearExtraction(userId: string, journalEntryId: string) {
    const memories = await this.prisma.memory.findMany({
      where: { userId, sourceType: 'JOURNAL_ENTRY', sourceId: journalEntryId },
      select: { id: true },
    });
    if (!memories.length) return;
    const ids = memories.map(({ id }) => id);
    await this.prisma.$transaction([
      this.prisma.$executeRaw`DELETE FROM "Embedding" WHERE "userId" = ${userId} AND "sourceType" = 'MEMORY'::"MemorySourceType" AND "sourceId" IN (${Prisma.join(ids)})`,
      this.prisma.memory.deleteMany({ where: { id: { in: ids }, userId } }),
    ]);
  }
}
