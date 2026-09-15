import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { AiModule } from 'src/ai/ai.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [AiModule, PrismaModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
