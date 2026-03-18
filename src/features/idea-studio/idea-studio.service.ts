import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { Prisma } from '@prisma/client';
import { IdeaStudioEngine } from '@/infrastructure/ai/engines/idea-studio/idea-studio.engine';
import { GenerateIdeaDto } from './dto/generate-idea.dto';

@Injectable()
export class IdeaStudioService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly engine: IdeaStudioEngine,
  ) {}

  async generate(userId: string, dto: GenerateIdeaDto) {
    const result = await this.engine.run({
      content: dto.content,
      tools: dto.tools,
      tone: dto.tone,
    });

    await this.prisma.aIResult.create({
      data: {
        domain: 'IDEA_STUDIO',
        tool: 'CHAIN',
        input: dto as unknown as Prisma.InputJsonValue,
        response: result as unknown as Prisma.InputJsonValue,
      },
    });

    return result;
  }
}
