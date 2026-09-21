import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createEventDto: CreateEventDto) {
    this.assertChronology(createEventDto.startAt, createEventDto.endAt);
    await this.assertOwnedLocation(userId, createEventDto.locationId);
    return this.prisma.lifeEvent.create({
      data: { ...createEventDto, userId } as Prisma.LifeEventUncheckedCreateInput,
    });
  }

  findAll(userId: string) {
    return this.prisma.lifeEvent.findMany({
      where: { userId },
      orderBy: { startAt: 'desc' },
      include: { location: true },
    });
  }

  async findOne(userId: string, id: string) {
    const event = await this.prisma.lifeEvent.findFirst({
      where: { id, userId },
      include: { location: true },
    });
    if (!event) {
      throw new NotFoundException(`Event ${id} not found`);
    }
    return event;
  }

  async update(userId: string, id: string, updateEventDto: UpdateEventDto) {
    const event = await this.findOne(userId, id);
    this.assertChronology(updateEventDto.startAt ?? event.startAt.toISOString(), updateEventDto.endAt ?? event.endAt?.toISOString());
    await this.assertOwnedLocation(userId, updateEventDto.locationId);
    return this.prisma.lifeEvent.update({
      where: { id },
      data: updateEventDto as Prisma.LifeEventUncheckedUpdateInput,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.lifeEvent.delete({ where: { id } });
    return { message: `Event ${id} has been deleted` };
  }

  private assertChronology(startAt: string, endAt?: string) {
    if (endAt && new Date(endAt) < new Date(startAt)) throw new BadRequestException('endAt must be after startAt');
  }

  private async assertOwnedLocation(userId: string, locationId?: string) {
    if (!locationId) return;
    const location = await this.prisma.lifeEntity.findFirst({ where: { id: locationId, userId }, select: { id: true } });
    if (!location) throw new BadRequestException('Location entity must belong to the authenticated user');
  }
}
