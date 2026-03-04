import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { GeminiProvider } from './providers/gemini.provider';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AiService, GeminiProvider],
  exports: [AiService],
})
export class AiModule {}
