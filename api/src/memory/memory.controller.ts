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
import { MemoryService } from './memory.service';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { UpdateMemoryDto } from './dto/update-memory.dto';

@ApiTags('Memory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('memory')
export class MemoryController {
  constructor(private readonly memoryService: MemoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new memory' })
  create(
    @Request() req: { user: { id: string } },
    @Body() createMemoryDto: CreateMemoryDto,
  ) {
    return this.memoryService.create(req.user.id, createMemoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all memories for the authenticated user' })
  findAll(@Request() req: { user: { id: string } }) {
    return this.memoryService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific memory by ID' })
  findOne(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.memoryService.findOne(req.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a memory' })
  update(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
    @Body() updateMemoryDto: UpdateMemoryDto,
  ) {
    return this.memoryService.update(req.user.id, id, updateMemoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a memory' })
  remove(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.memoryService.remove(req.user.id, id);
  }
}
