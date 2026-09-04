import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalService {
  constructor(private prisma: PrismaService) {}

  create(createGoalDto: CreateGoalDto) {
    return this.prisma.goal.create({
      data: createGoalDto as Prisma.GoalUncheckedCreateInput,
    });
  }

  findAll() {
    return this.prisma.goal.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const goal = await this.prisma.goal.findUnique({
      where: { id },
      include: { tasks: true },
    });

    if (!goal) {
      throw new NotFoundException(`Goal ${id} not found`);
    }

    return goal;
  }

  async update(id: string, updateGoalDto: UpdateGoalDto) {
    await this.findOne(id);
    return this.prisma.goal.update({
      where: { id },
      data: updateGoalDto as Prisma.GoalUncheckedUpdateInput,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.goal.delete({ where: { id } });
    return { message: `Goal ${id} has been deleted` };
  }
}
