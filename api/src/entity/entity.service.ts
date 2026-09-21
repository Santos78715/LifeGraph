import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { CreateEntityDto } from './dto/create-entity.dto';
import { UpdateEntityDto } from './dto/update-entity.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EntityService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, createEntityDto: CreateEntityDto) {
    return this.prisma.lifeEntity.create({
      data: { ...createEntityDto, userId } as Prisma.LifeEntityUncheckedCreateInput,
    });
  }

  findAll(userId: string) {
    return this.prisma.lifeEntity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const entity = await this.prisma.lifeEntity.findFirst({
      where: { id, userId },
    });
    if (!entity) {
      throw new NotFoundException(`Entity ${id} not found`);
    }
    return entity;
  }

  async update(userId: string, id: string, updateEntityDto: UpdateEntityDto) {
    await this.findOne(userId, id);
    return this.prisma.lifeEntity.update({
      where: { id },
      data: updateEntityDto as Prisma.LifeEntityUncheckedUpdateInput,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.lifeEntity.delete({ where: { id } });
    return { message: `Entity ${id} has been deleted` };
  }
}
