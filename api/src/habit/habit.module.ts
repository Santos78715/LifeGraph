import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { HabitController } from './habit.controller';
import { HabitService } from './habit.service';

@Module({
  imports: [PrismaModule],
  controllers: [HabitController],
  providers: [HabitService],
})
export class HabitModule {}
