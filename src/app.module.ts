import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TestModule } from '../test/test.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { IdeasModule } from './ideas/ideas.module';
import { AiModule } from './infrastructure/ai/ai.module';
import { IdeaStudioController } from './idea-studio/features/idea-studio/idea-studio.controller';
import { IdeaStudioService } from './idea-studio/features/idea-studio/idea-studio.service';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 10, // 10 requests per 60 seconds
      },
    ]),
    PrismaModule,
    TestModule,
    UsersModule,
    AuthModule,
    IdeasModule,
    AiModule,
  ],
  controllers: [AppController, IdeaStudioController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    IdeaStudioService,
  ],
})
export class AppModule {}
