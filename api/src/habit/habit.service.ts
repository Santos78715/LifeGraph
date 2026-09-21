import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { CreateHabitLogDto } from './dto/create-habit-log.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';

@Injectable()
export class HabitService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, createHabitDto: CreateHabitDto) {
    return this.prisma.habit.create({
      data: { ...createHabitDto, userId } as Prisma.HabitUncheckedCreateInput,
    });
  }

  findAll(userId: string) {
    return this.prisma.habit.findMany({
      where: { userId },
      include: { logs: { orderBy: { date: 'desc' }, take: 30 } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const habit = await this.prisma.habit.findFirst({
      where: { id, userId },
      include: { logs: { orderBy: { date: 'desc' } } },
    });
    if (!habit) {
      throw new NotFoundException(`Habit ${id} not found`);
    }
    return habit;
  }

  async update(userId: string, id: string, updateHabitDto: UpdateHabitDto) {
    await this.findOne(userId, id);
    return this.prisma.habit.update({
      where: { id },
      data: updateHabitDto as Prisma.HabitUncheckedUpdateInput,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.habit.delete({ where: { id } });
    return { message: `Habit ${id} has been deleted` };
  }

  async createLog(userId: string, id: string, createHabitLogDto: CreateHabitLogDto) {
    await this.findOne(userId, id);
    return this.prisma.habitLog.upsert({
      where: {
        habitId_date: {
          habitId: id,
          date: createHabitLogDto.date,
        },
      },
      create: {
        habitId: id,
        ...createHabitLogDto,
      } as Prisma.HabitLogUncheckedCreateInput,
      update: createHabitLogDto as Prisma.HabitLogUncheckedUpdateInput,
    });
  }
}
