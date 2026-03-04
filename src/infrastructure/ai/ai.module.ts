import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { GeminiProvider } from './providers/gemini.provider';
import { PrismaModule } from '@/prisma/prisma.module';
import { IdeaVaultService } from '@/features/idea-vault/idea-vault.service';

@Module({
  imports: [PrismaModule, IdeaVaultService],
  providers: [AiService, GeminiProvider],
  exports: [AiService],
})
export class AiModule {}
