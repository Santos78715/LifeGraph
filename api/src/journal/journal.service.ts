import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJournalDto } from './dto/create-journal.dto';
import { UpdateJournalDto } from './dto/update-journal.dto';
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
    return this.prisma.journalEntry.update({
      where: { id },
      data: updateJournalDto,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.journalEntry.delete({ where: { id } });
    return { message: `Journal entry ${id} has been deleted` };
  }
}
