import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createGoalDto: CreateGoalDto) {
    await this.assertOwnedEntity(userId, createGoalDto.entityId);
    return this.prisma.goal.create({
      data: { ...createGoalDto, userId } as Prisma.GoalUncheckedCreateInput,
    });
  }

  findAll(userId: string) {
    return this.prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { tasks: true },
    });
  }

  async findOne(userId: string, id: string) {
    const goal = await this.prisma.goal.findFirst({
      where: { id, userId },
      include: { tasks: true },
    });
    if (!goal) {
      throw new NotFoundException(`Goal ${id} not found`);
    }
    return goal;
  }

  async update(userId: string, id: string, updateGoalDto: UpdateGoalDto) {
    await this.findOne(userId, id);
    await this.assertOwnedEntity(userId, updateGoalDto.entityId);
    return this.prisma.goal.update({
      where: { id },
      data: updateGoalDto as Prisma.GoalUncheckedUpdateInput,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.goal.delete({ where: { id } });
    return { message: `Goal ${id} has been deleted` };
  }

  private async assertOwnedEntity(userId: string, entityId?: string) {
    if (!entityId) return;
    const entity = await this.prisma.lifeEntity.findFirst({ where: { id: entityId, userId }, select: { id: true } });
    if (!entity) throw new BadRequestException('Related entity must belong to the authenticated user');
  }
}
