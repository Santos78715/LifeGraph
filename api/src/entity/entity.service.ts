import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { CreateEntityDto } from './dto/create-entity.dto';
import { UpdateEntityDto } from './dto/update-entity.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EntityService {
  constructor(private prisma: PrismaService) {}

  create(createEntityDto: CreateEntityDto) {
    return this.prisma.lifeEntity.create({
      data: createEntityDto as Prisma.LifeEntityUncheckedCreateInput,
    });
  }

  findAll() {
    return this.prisma.lifeEntity.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const entity = await this.prisma.lifeEntity.findUnique({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`Entity ${id} not found`);
    }

    return entity;
  }

  async update(id: string, updateEntityDto: UpdateEntityDto) {
    await this.findOne(id);
    return this.prisma.lifeEntity.update({
      where: { id },
      data: updateEntityDto as Prisma.LifeEntityUncheckedUpdateInput,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.lifeEntity.delete({ where: { id } });
    return { message: `Entity ${id} has been deleted` };
  }
}
