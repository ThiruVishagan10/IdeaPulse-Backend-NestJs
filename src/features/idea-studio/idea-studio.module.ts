import { Module } from '@nestjs/common';
import { IdeaStudioController } from './idea-studio.controller';
import { IdeaStudioService } from './idea-studio.service';
import { PrismaService } from '@/prisma/prisma.service';
import { IdeaStudioEngine } from '@/infrastructure/ai/engines/idea-studio/idea-studio.engine';
import { GeminiProvider } from '@/infrastructure/ai/providers/gemini.provider';

@Module({
  controllers: [IdeaStudioController],
  providers: [
    IdeaStudioService,
    IdeaStudioEngine,
    GeminiProvider,
    PrismaService,
  ],
})
export class IdeaStudioModule {}
