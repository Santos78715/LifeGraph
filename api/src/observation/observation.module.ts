import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ObservationController } from './observation.controller';
import { ObservationService } from './observation.service';

@Module({
  imports: [PrismaModule],
  controllers: [ObservationController],
  providers: [ObservationService],
})
export class ObservationModule {}
