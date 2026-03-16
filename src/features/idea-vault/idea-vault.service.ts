import { Injectable } from '@nestjs/common';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { CreateVersionDto } from './dto/create-version.dto';
import { PrismaService } from '../../prisma/prisma.service';
import type { Prisma } from '@prisma/client';

@Injectable()
export class IdeaVaultService {
  constructor(private readonly prisma: PrismaService) {}

  async createIdea(userId: string, dto: CreateIdeaDto) {
    const idea = await this.prisma.idea.create({
      data: {
        userId: userId,
        version: {
          create: {
            version: 1,
            title: dto.title,
            content: dto.description,
            sourceType: 'USER',
          },
        },
        currentVersion: 1,
      },
      include: {
        version: true,
      },
    });

    return idea;
  }

  async getIdeas(userId: string) {
    return this.prisma.idea.findMany({
      where: { userId: userId },
      include: {
        version: true,
      },
    });
  }

  async getIdeaById(id: string) {
    return this.prisma.idea.findUnique({
      where: { id },
      include: {
        version: {
          include: {
            aiResults: true,
          },
        },
      },
    });
  }

  async createVersion(ideaId: string, dto: CreateVersionDto) {
    const latest = await this.prisma.ideaVersion.findFirst({
      where: { ideaId: ideaId },
      orderBy: { version: 'desc' },
    });

    const nextVersion = (latest?.version || 0) + 1;

    await this.prisma.idea.update({
      where: { id: ideaId },
      data: { currentVersion: nextVersion },
    });

    return this.prisma.ideaVersion.create({
      data: {
        ideaId: ideaId,
        version: nextVersion,
        title: dto.title,
        content: dto.content,
        sourceType: 'USER',
      },
    });
  }

  async saveAIResult(
    ideaVersionId: string,
    toolName: string,
    result: Record<string, unknown>,
  ) {
    return await this.prisma.aIResult.create({
      data: {
        ideaVersionId: ideaVersionId,
        domain: 'IDEA_VAULT',
        tool: toolName,
        response: result as Prisma.InputJsonValue,
      },
    });
  }

  async getIdeaTimeline(ideaId: string) {
    const idea = await this.prisma.idea.findUnique({
      where: { id: ideaId },
      include: {
        version: {
          orderBy: {
            version: 'asc',
          },
          include: {
            aiResults: true,
          },
        },
      },
    });

    if (!idea) return null;

    return {
      ideaId: idea.id,
      title: idea.version[0]?.title || '',
      timeline: idea.version.map((v) => ({
        version: v.version,
        createdAt: v.createdAt,
        tools: v.aiResults.map((r) => ({
          tool: r.tool,
        })),
      })),
    };
  }
}
