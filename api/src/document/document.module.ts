import { Module } from '@nestjs/common';
import { AiModule } from 'src/ai/ai.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';

@Module({
  imports: [AiModule, PrismaModule],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
