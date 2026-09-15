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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentService } from './document.service';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('text')
  create(
    @Request() request: { user: { id: string } },
    @Body() input: CreateDocumentDto,
  ) {
    return this.documentService.create(request.user.id, input);
  }

  @Get()
  findAll(@Request() request: { user: { id: string } }) {
    return this.documentService.findAll(request.user.id);
  }

  @Get(':id')
  findOne(
    @Request() request: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.documentService.findOne(request.user.id, id);
  }

  @Post(':id/analyze')
  analyze(
    @Request() request: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.documentService.analyze(request.user.id, id);
  }

  @Delete(':id')
  remove(
    @Request() request: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.documentService.remove(request.user.id, id);
  }
}
