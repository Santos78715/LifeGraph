import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  create(createEventDto: CreateEventDto) {
    return this.prisma.lifeEvent.create({
      data: createEventDto as Prisma.LifeEventUncheckedCreateInput,
    });
  }

  findAll() {
    return this.prisma.lifeEvent.findMany({ orderBy: { startAt: 'desc' } });
  }

  async findOne(id: string) {
    const event = await this.prisma.lifeEvent.findUnique({ where: { id } });

    if (!event) {
      throw new NotFoundException(`Event ${id} not found`);
    }

    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    await this.findOne(id);
    return this.prisma.lifeEvent.update({
      where: { id },
      data: updateEventDto as Prisma.LifeEventUncheckedUpdateInput,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.lifeEvent.delete({ where: { id } });
    return { message: `Event ${id} has been deleted` };
  }
}
