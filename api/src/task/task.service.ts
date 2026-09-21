import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from '../../generated/prisma/client';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createTaskDto: CreateTaskDto) {
    await this.assertOwnedGoal(userId, createTaskDto.goalId);
    const data = this.applyCompletionTimestamp(createTaskDto);
    return this.prisma.task.create({
      data: { ...data, userId } as Prisma.TaskUncheckedCreateInput,
    });
  }

  findAll(userId: string) {
    return this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { goal: true },
    });
  }

  async findOne(userId: string, id: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
      include: { goal: true },
    });
    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    return task;
  }

  async update(userId: string, id: string, updateTaskDto: UpdateTaskDto) {
    await this.findOne(userId, id);
    await this.assertOwnedGoal(userId, updateTaskDto.goalId);
    const data = this.applyCompletionTimestamp(updateTaskDto);
    return this.prisma.task.update({
      where: { id },
      data: data as Prisma.TaskUncheckedUpdateInput,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.task.delete({ where: { id } });
    return { message: `Task ${id} has been deleted` };
  }

  private async assertOwnedGoal(userId: string, goalId?: string) {
    if (!goalId) return;
    const goal = await this.prisma.goal.findFirst({ where: { id: goalId, userId }, select: { id: true } });
    if (!goal) throw new BadRequestException('Parent goal must belong to the authenticated user');
  }

  private applyCompletionTimestamp(dto: CreateTaskDto | UpdateTaskDto) {
    if (dto.status === TaskStatus.COMPLETED && !dto.completedAt) return { ...dto, completedAt: new Date().toISOString() };
    if (dto.status && dto.status !== TaskStatus.COMPLETED && dto.completedAt === undefined) return { ...dto, completedAt: null };
    return dto;
  }
}
