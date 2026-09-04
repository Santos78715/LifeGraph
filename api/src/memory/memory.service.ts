import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { UpdateMemoryDto } from './dto/update-memory.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MemoryService {
  constructor(private prisma: PrismaService) {}

  create(createMemoryDto: CreateMemoryDto) {
    return this.prisma.memory.create({ data: createMemoryDto });
  }

  findAll() {
    return this.prisma.memory.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const memory = await this.prisma.memory.findUnique({ where: { id } });

    if (!memory) {
      throw new NotFoundException(`Memory ${id} not found`);
    }

    return memory;
  }

  async update(id: string, updateMemoryDto: UpdateMemoryDto) {
    await this.findOne(id);
    return this.prisma.memory.update({ where: { id }, data: updateMemoryDto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.memory.delete({ where: { id } });
    return { message: `Memory ${id} has been deleted` };
  }
}
