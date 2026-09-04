import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJournalDto } from './dto/create-journal.dto';
import { UpdateJournalDto } from './dto/update-journal.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JournalService {
  constructor(private prisma: PrismaService) {}

  create(createJournalDto: CreateJournalDto) {
    return this.prisma.journalEntry.create({ data: createJournalDto });
  }

  findAll() {
    return this.prisma.journalEntry.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const journal = await this.prisma.journalEntry.findUnique({
      where: { id },
    });

    if (!journal) {
      throw new NotFoundException(`Journal entry ${id} not found`);
    }

    return journal;
  }

  async update(id: string, updateJournalDto: UpdateJournalDto) {
    await this.findOne(id);
    return this.prisma.journalEntry.update({
      where: { id },
      data: updateJournalDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.journalEntry.delete({ where: { id } });
    return { message: `Journal entry ${id} has been deleted` };
  }
}
