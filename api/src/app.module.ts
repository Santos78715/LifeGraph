import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { JournalModule } from './journal/journal.module';
import { MemoryModule } from './memory/memory.module';
import { EntityModule } from './entity/entity.module';
import { RelationshipsModule } from './relationships/relationships.module';
import { AiModule } from './ai/ai.module';
import { EmbeddingModule } from './embedding/embedding.module';
import { SearchModule } from './search/search.module';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { ObservationModule } from './observation/observation.module';
import { GoalModule } from './goal/goal.module';
import { TaskModule } from './task/task.module';
import { HabitModule } from './habit/habit.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 10, // 10 requests per minute
      },
    ]),
    PrismaModule,
    AuthModule,
    UserModule,
    JournalModule,
    MemoryModule,
    EntityModule,
    RelationshipsModule,
    AiModule,
    EmbeddingModule,
    SearchModule,
    CommonModule,
    ObservationModule,
    GoalModule,
    TaskModule,
    HabitModule,
    EventModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
