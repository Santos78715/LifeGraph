import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateHabitDto } from './dto/create-habit.dto';
import { CreateHabitLogDto } from './dto/create-habit-log.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { HabitService } from './habit.service';

@ApiTags('Habit')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('habit')
export class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new habit' })
  create(
    @Request() req: { user: { id: string } },
    @Body() createHabitDto: CreateHabitDto,
  ) {
    return this.habitService.create(req.user.id, createHabitDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all habits with recent logs' })
  findAll(@Request() req: { user: { id: string } }) {
    return this.habitService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific habit with its logs' })
  findOne(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.habitService.findOne(req.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a habit' })
  update(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
    @Body() updateHabitDto: UpdateHabitDto,
  ) {
    return this.habitService.update(req.user.id, id, updateHabitDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a habit and its logs' })
  remove(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.habitService.remove(req.user.id, id);
  }

  @Post(':id/logs')
  @ApiOperation({ summary: 'Log a habit entry (upserts by date)' })
  createLog(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
    @Body() createHabitLogDto: CreateHabitLogDto,
  ) {
    return this.habitService.createLog(req.user.id, id, createHabitLogDto);
  }
}
