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
import { RelationshipsService } from './relationships.service';
import { CreateRelationshipDto } from './dto/create-relationship.dto';
import { UpdateRelationshipDto } from './dto/update-relationship.dto';

@ApiTags('Relationships')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller(['relationships', 'entityrelationship', 'entity-relationship'])
export class RelationshipsController {
  constructor(private readonly relationshipsService: RelationshipsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new entity relationship' })
  create(
    @Request() req: { user: { id: string } },
    @Body() createRelationshipDto: CreateRelationshipDto,
  ) {
    return this.relationshipsService.create(req.user.id, createRelationshipDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all relationships for the authenticated user' })
  findAll(@Request() req: { user: { id: string } }) {
    return this.relationshipsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific relationship by ID' })
  findOne(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.relationshipsService.findOne(req.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a relationship' })
  update(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
    @Body() updateRelationshipDto: UpdateRelationshipDto,
  ) {
    return this.relationshipsService.update(req.user.id, id, updateRelationshipDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a relationship' })
  remove(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.relationshipsService.remove(req.user.id, id);
  }
}
