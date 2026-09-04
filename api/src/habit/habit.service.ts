import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { CreateHabitLogDto } from './dto/create-habit-log.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';

@Injectable()
export class HabitService {
  constructor(private prisma: PrismaService) {}

  create(createHabitDto: CreateHabitDto) {
    return this.prisma.habit.create({
      data: createHabitDto as Prisma.HabitUncheckedCreateInput,
    });
  }

  findAll() {
    return this.prisma.habit.findMany({
      include: { logs: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const habit = await this.prisma.habit.findUnique({
      where: { id },
      include: { logs: true },
    });

    if (!habit) {
      throw new NotFoundException(`Habit ${id} not found`);
    }

    return habit;
  }

  async update(id: string, updateHabitDto: UpdateHabitDto) {
    await this.findOne(id);
    return this.prisma.habit.update({
      where: { id },
      data: updateHabitDto as Prisma.HabitUncheckedUpdateInput,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.habit.delete({ where: { id } });
    return { message: `Habit ${id} has been deleted` };
  }

  async createLog(id: string, createHabitLogDto: CreateHabitLogDto) {
    await this.findOne(id);

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
