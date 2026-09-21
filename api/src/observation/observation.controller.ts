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
import { CreateObservationDto } from './dto/create-observation.dto';
import { UpdateObservationDto } from './dto/update-observation.dto';
import { ObservationService } from './observation.service';

@ApiTags('Observation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('observation')
export class ObservationController {
  constructor(private readonly observationService: ObservationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new observation' })
  create(
    @Request() req: { user: { id: string } },
    @Body() createObservationDto: CreateObservationDto,
  ) {
    return this.observationService.create(req.user.id, createObservationDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all observations for the authenticated user' })
  findAll(@Request() req: { user: { id: string } }) {
    return this.observationService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific observation by ID' })
  findOne(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.observationService.findOne(req.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an observation' })
  update(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
    @Body() updateObservationDto: UpdateObservationDto,
  ) {
    return this.observationService.update(req.user.id, id, updateObservationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an observation' })
  remove(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.observationService.remove(req.user.id, id);
  }
}
