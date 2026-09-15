import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SearchService } from './search.service';
import { CreateSearchDto } from './dto/create-search.dto';

@Controller('search')
@UseGuards(JwtAuthGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post()
  search(
    @Request() request: { user: { id: string } },
    @Body() createSearchDto: CreateSearchDto,
  ) {
    return this.searchService.search(request.user.id, createSearchDto);
  }
}
