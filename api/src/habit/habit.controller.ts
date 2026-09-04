import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateHabitDto } from './dto/create-habit.dto';
import { CreateHabitLogDto } from './dto/create-habit-log.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { HabitService } from './habit.service';

@Controller('habit')
export class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @Post()
  create(@Body() createHabitDto: CreateHabitDto) {
    return this.habitService.create(createHabitDto);
  }

  @Get()
  findAll() {
    return this.habitService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.habitService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHabitDto: UpdateHabitDto) {
    return this.habitService.update(id, updateHabitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.habitService.remove(id);
  }

  @Post(':id/logs')
  createLog(
    @Param('id') id: string,
    @Body() createHabitLogDto: CreateHabitLogDto,
  ) {
    return this.habitService.createLog(id, createHabitLogDto);
  }
}
