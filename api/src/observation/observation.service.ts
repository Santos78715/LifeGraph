import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateObservationDto } from './dto/create-observation.dto';
import { UpdateObservationDto } from './dto/update-observation.dto';

@Injectable()
export class ObservationService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createObservationDto: CreateObservationDto) {
    await this.assertOwnedEntity(userId, createObservationDto.entityId);
    return this.prisma.observation.create({
      data: {
        ...createObservationDto,
        userId,
      } as Prisma.ObservationUncheckedCreateInput,
    });
  }

  findAll(userId: string) {
    return this.prisma.observation.findMany({
      where: { userId },
      orderBy: { observedAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const observation = await this.prisma.observation.findFirst({
      where: { id, userId },
    });
    if (!observation) {
      throw new NotFoundException(`Observation ${id} not found`);
    }
    return observation;
  }

  async update(userId: string, id: string, updateObservationDto: UpdateObservationDto) {
    await this.findOne(userId, id);
    await this.assertOwnedEntity(userId, updateObservationDto.entityId);
    return this.prisma.observation.update({
      where: { id },
      data: updateObservationDto as Prisma.ObservationUncheckedUpdateInput,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.observation.delete({ where: { id } });
    return { message: `Observation ${id} has been deleted` };
  }

  private async assertOwnedEntity(userId: string, entityId?: string) {
    if (!entityId) return;
    const entity = await this.prisma.lifeEntity.findFirst({ where: { id: entityId, userId }, select: { id: true } });
    if (!entity) throw new BadRequestException('Related entity must belong to the authenticated user');
  }
}
