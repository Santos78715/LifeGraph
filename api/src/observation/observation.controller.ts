import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateObservationDto } from './dto/create-observation.dto';
import { UpdateObservationDto } from './dto/update-observation.dto';
import { ObservationService } from './observation.service';

@Controller('observation')
export class ObservationController {
  constructor(private readonly observationService: ObservationService) {}

  @Post()
  create(@Body() createObservationDto: CreateObservationDto) {
    return this.observationService.create(createObservationDto);
  }

  @Get()
  findAll() {
    return this.observationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.observationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateObservationDto: UpdateObservationDto,
  ) {
    return this.observationService.update(id, updateObservationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.observationService.remove(id);
  }
}
