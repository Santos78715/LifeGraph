import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { EntityService } from './entity.service';
import { CreateEntityDto } from './dto/create-entity.dto';
import { UpdateEntityDto } from './dto/update-entity.dto';

@ApiTags('Entity')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller(['entity', 'life-entity'])
export class EntityController {
  constructor(private readonly entityService: EntityService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new life entity' })
  create(
    @Request() req: { user: { id: string } },
    @Body() createEntityDto: CreateEntityDto,
  ) {
    return this.entityService.create(req.user.id, createEntityDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all entities for the authenticated user' })
  findAll(@Request() req: { user: { id: string } }) {
    return this.entityService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific entity by ID' })
  findOne(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.entityService.findOne(req.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an entity' })
  update(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
    @Body() updateEntityDto: UpdateEntityDto,
  ) {
    return this.entityService.update(req.user.id, id, updateEntityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an entity' })
  remove(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.entityService.remove(req.user.id, id);
  }
}
