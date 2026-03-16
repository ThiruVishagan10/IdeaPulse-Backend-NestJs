import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { CreateVersionDto } from './dto/create-version.dto';
import { IdeaStatus } from '@prisma/client';

@Injectable()
export class IdeasService {
  constructor(private readonly prisma: PrismaService) {}

  // Create new idea with version 1
  async create(userId: string, dto: CreateIdeaDto) {
    return this.prisma.$transaction(async (tx) => {
      const idea = await tx.idea.create({
        data: {
          userId,
          status: IdeaStatus.ACTIVE,
          currentVersion: 1,
        },
      });

      const version = await tx.ideaVersion.create({
        data: {
          ideaId: idea.id,
          version: 1,
          title: dto.title,
          content: dto.content,
        },
      });

      return {
        ...idea,
        latestVersion: version,
      };
    });
  }

  // Append new version (Atomic + Safe)
  async addVersion(userId: string, ideaId: string, dto: CreateVersionDto) {
    return this.prisma.$transaction(async (tx) => {
      const idea = await tx.idea.findFirst({
        where: {
          id: ideaId,
          userId,
        },
        select: {
          id: true,
          status: true,
        },
      });

      if (!idea) {
        throw new NotFoundException('Idea not found');
      }

      if (idea.status !== IdeaStatus.ACTIVE) {
        throw new ForbiddenException('Idea is not editable');
      }

      // Atomic increment
      const { currentVersion } = await tx.idea.update({
        where: { id: ideaId },
        data: {
          currentVersion: { increment: 1 },
        },
        select: { currentVersion: true },
      });

      const newVersion = await tx.ideaVersion.create({
        data: {
          ideaId,
          version: currentVersion,
          title: dto.title,
          content: dto.content,
        },
      });

      return newVersion;
    });
  }

  // Paginated ideas with latest version (Optimized)
  async findAll(userId: string, page = 0, limit = 20) {
    limit = Math.min(Number(limit) || 20, 50);
    page = Number(page) || 0;

    const ideas = await this.prisma.idea.findMany({
      where: {
        userId,
        status: {
          not: IdeaStatus.DELETED,
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: page * limit,
      take: limit,
      select: {
        id: true,
        status: true,
        currentVersion: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (ideas.length === 0) return [];

    const ideaIds = ideas.map((i) => i.id);

    const latestVersions = await this.prisma.ideaVersion.findMany({
      where: {
        ideaId: { in: ideaIds },
      },
      orderBy: [{ ideaId: 'asc' }, { version: 'desc' }],
      distinct: ['ideaId'],
    });

    const versionMap = new Map(latestVersions.map((v) => [v.ideaId, v]));

    return ideas.map((idea) => ({
      ...idea,
      latestVersion: versionMap.get(idea.id),
    }));
  }

  // Get full history
  async findOne(userId: string, ideaId: string) {
    const idea = await this.prisma.idea.findFirst({
      where: {
        id: ideaId,
        userId,
        status: {
          not: IdeaStatus.DELETED,
        },
      },
      include: {
        version: {
          orderBy: { version: 'desc' },
        },
      },
    });

    if (!idea) {
      throw new NotFoundException('Idea not found');
    }

    return idea;
  }

  // Archive idea
  async archive(userId: string, ideaId: string) {
    const idea = await this.prisma.idea.findFirst({
      where: {
        id: ideaId,
        userId,
      },
      select: { id: true },
    });

    if (!idea) {
      throw new NotFoundException('Idea not found');
    }

    return this.prisma.idea.update({
      where: { id: ideaId },
      data: { status: IdeaStatus.ARCHIVED },
    });
  }

  // Soft delete (status-based)
  async softDelete(userId: string, ideaId: string) {
    const idea = await this.prisma.idea.findFirst({
      where: {
        id: ideaId,
        userId,
      },
      select: { id: true },
    });

    if (!idea) {
      throw new NotFoundException('Idea not found');
    }

    return this.prisma.idea.update({
      where: { id: ideaId },
      data: { status: IdeaStatus.DELETED },
    });
  }
}
