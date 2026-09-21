import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { CreateRelationshipDto } from './dto/create-relationship.dto';
import { UpdateRelationshipDto } from './dto/update-relationship.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RelationshipsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createRelationshipDto: CreateRelationshipDto) {
    await this.assertOwnedEntities(userId, createRelationshipDto.sourceEntityId, createRelationshipDto.targetEntityId);
    return this.prisma.entityRelationship.create({
      data: {
        ...createRelationshipDto,
        userId,
      } as Prisma.EntityRelationshipUncheckedCreateInput,
    });
  }

  findAll(userId: string) {
    return this.prisma.entityRelationship.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { sourceEntity: true, targetEntity: true },
    });
  }

  async findOne(userId: string, id: string) {
    const relationship = await this.prisma.entityRelationship.findFirst({
      where: { id, userId },
      include: { sourceEntity: true, targetEntity: true },
    });
    if (!relationship) {
      throw new NotFoundException(`Relationship ${id} not found`);
    }
    return relationship;
  }

  async update(userId: string, id: string, updateRelationshipDto: UpdateRelationshipDto) {
    await this.findOne(userId, id);
    if (updateRelationshipDto.sourceEntityId || updateRelationshipDto.targetEntityId) {
      const current = await this.findOne(userId, id);
      await this.assertOwnedEntities(userId, updateRelationshipDto.sourceEntityId ?? current.sourceEntityId, updateRelationshipDto.targetEntityId ?? current.targetEntityId);
    }
    return this.prisma.entityRelationship.update({
      where: { id },
      data: updateRelationshipDto as Prisma.EntityRelationshipUncheckedUpdateInput,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.entityRelationship.delete({ where: { id } });
    return { message: `Relationship ${id} has been deleted` };
  }

  private async assertOwnedEntities(userId: string, sourceEntityId: string, targetEntityId: string) {
    if (sourceEntityId === targetEntityId) throw new BadRequestException('A relationship must connect two different entities');
    const count = await this.prisma.lifeEntity.count({ where: { userId, id: { in: [sourceEntityId, targetEntityId] } } });
    if (count !== 2) throw new BadRequestException('Both entities must belong to the authenticated user');
  }
}
