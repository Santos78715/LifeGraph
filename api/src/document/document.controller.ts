import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentService } from './document.service';

@ApiTags('Document')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('text')
  @ApiOperation({ summary: 'Upload a text document (auto-chunks and embeds)' })
  create(
    @Request() request: { user: { id: string } },
    @Body() input: CreateDocumentDto,
  ) {
    return this.documentService.create(request.user.id, input);
  }

  @Get()
  @ApiOperation({ summary: 'List all documents' })
  findAll(@Request() request: { user: { id: string } }) {
    return this.documentService.findAll(request.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a document with its chunks' })
  findOne(
    @Request() request: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.documentService.findOne(request.user.id, id);
  }

  @Post(':id/analyze')
  @ApiOperation({ summary: 'Analyze a document with AI' })
  analyze(
    @Request() request: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.documentService.analyze(request.user.id, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a document' })
  remove(
    @Request() request: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.documentService.remove(request.user.id, id);
  }
}
