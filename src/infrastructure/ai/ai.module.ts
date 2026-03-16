import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { GeminiProvider } from './providers/gemini.provider';
import { PrismaModule } from '../../prisma/prisma.module';
import { IdeaVaultModule } from '../../features/idea-vault/idea-vault.module';

@Module({
  imports: [PrismaModule, IdeaVaultModule],
  providers: [AiService, GeminiProvider],
  exports: [AiService],
})
export class AiModule {}
