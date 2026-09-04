import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  create(createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: createTaskDto as Prisma.TaskUncheckedCreateInput,
    });
  }

  findAll() {
    return this.prisma.task.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    await this.findOne(id);
    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto as Prisma.TaskUncheckedUpdateInput,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.task.delete({ where: { id } });
    return { message: `Task ${id} has been deleted` };
  }
}
