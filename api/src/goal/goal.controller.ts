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
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalService } from './goal.service';

@ApiTags('Goal')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('goal')
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new goal' })
  create(
    @Request() req: { user: { id: string } },
    @Body() createGoalDto: CreateGoalDto,
  ) {
    return this.goalService.create(req.user.id, createGoalDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all goals for the authenticated user' })
  findAll(@Request() req: { user: { id: string } }) {
    return this.goalService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific goal with its tasks' })
  findOne(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.goalService.findOne(req.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a goal' })
  update(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
    @Body() updateGoalDto: UpdateGoalDto,
  ) {
    return this.goalService.update(req.user.id, id, updateGoalDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a goal' })
  remove(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.goalService.remove(req.user.id, id);
  }
}
