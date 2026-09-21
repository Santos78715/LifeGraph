import {
  Controller,
  Get,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { EmbeddingService } from './embedding.service';

@ApiTags('Embedding')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('embedding')
export class EmbeddingController {
  constructor(private readonly embeddingService: EmbeddingService) {}

  @Get()
  @ApiOperation({ summary: 'List all embeddings for the authenticated user' })
  findAll(@Request() req: { user: { id: string } }) {
    return this.embeddingService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific embedding by ID' })
  findOne(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.embeddingService.findOne(req.user.id, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an embedding' })
  remove(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.embeddingService.remove(req.user.id, id);
  }
}
