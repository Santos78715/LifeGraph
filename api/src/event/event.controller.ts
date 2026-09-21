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
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventService } from './event.service';

@ApiTags('Event')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller(['event', 'life-event'])
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new life event' })
  create(
    @Request() req: { user: { id: string } },
    @Body() createEventDto: CreateEventDto,
  ) {
    return this.eventService.create(req.user.id, createEventDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all events for the authenticated user' })
  findAll(@Request() req: { user: { id: string } }) {
    return this.eventService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific event by ID' })
  findOne(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.eventService.findOne(req.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an event' })
  update(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventService.update(req.user.id, id, updateEventDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an event' })
  remove(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.eventService.remove(req.user.id, id);
  }
}
