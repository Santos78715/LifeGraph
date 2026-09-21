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
import { JournalService } from './journal.service';
import { CreateJournalDto } from './dto/create-journal.dto';
import { UpdateJournalDto } from './dto/update-journal.dto';

@ApiTags('Journal')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller(['journal', 'journal-entry'])
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Post()
  @ApiOperation({ summary: 'Create a journal entry (triggers AI extraction)' })
  create(
    @Request() request: { user: { id: string } },
    @Body() createJournalDto: CreateJournalDto,
  ) {
    return this.journalService.create(request.user.id, createJournalDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all journal entries' })
  findAll(@Request() request: { user: { id: string } }) {
    return this.journalService.findAll(request.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific journal entry' })
  findOne(
    @Request() request: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.journalService.findOne(request.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a journal entry' })
  update(
    @Request() request: { user: { id: string } },
    @Param('id') id: string,
    @Body() updateJournalDto: UpdateJournalDto,
  ) {
    return this.journalService.update(request.user.id, id, updateJournalDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a journal entry' })
  remove(
    @Request() request: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.journalService.remove(request.user.id, id);
  }
}
