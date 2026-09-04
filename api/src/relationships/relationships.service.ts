import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { CreateRelationshipDto } from './dto/create-relationship.dto';
import { UpdateRelationshipDto } from './dto/update-relationship.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RelationshipsService {
  constructor(private prisma: PrismaService) {}

  create(createRelationshipDto: CreateRelationshipDto) {
    return this.prisma.entityRelationship.create({
      data: createRelationshipDto as Prisma.EntityRelationshipUncheckedCreateInput,
    });
  }

  findAll() {
    return this.prisma.entityRelationship.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const relationship = await this.prisma.entityRelationship.findUnique({
      where: { id },
    });

    if (!relationship) {
      throw new NotFoundException(`Relationship ${id} not found`);
    }

    return relationship;
  }

  async update(id: string, updateRelationshipDto: UpdateRelationshipDto) {
    await this.findOne(id);
    return this.prisma.entityRelationship.update({
      where: { id },
      data: updateRelationshipDto as Prisma.EntityRelationshipUncheckedUpdateInput,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.entityRelationship.delete({ where: { id } });
    return { message: `Relationship ${id} has been deleted` };
  }
}
