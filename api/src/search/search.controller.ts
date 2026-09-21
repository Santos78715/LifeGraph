import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SearchService } from './search.service';
import { CreateSearchDto } from './dto/create-search.dto';

@ApiTags('Search')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post()
  @ApiOperation({ summary: 'Semantic search across memories and documents (RAG)' })
  search(
    @Request() request: { user: { id: string } },
    @Body() createSearchDto: CreateSearchDto,
  ) {
    return this.searchService.search(request.user.id, createSearchDto);
  }
}
