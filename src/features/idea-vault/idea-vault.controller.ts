import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { IdeaVaultService } from './idea-vault.service';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { CreateVersionDto } from './dto/create-version.dto';

@Controller('idea-vault')
export class IdeaVaultController {
  constructor(private readonly vaultService: IdeaVaultService) {}

  @Post('ideas')
  createIdea(@Body() dto: CreateIdeaDto) {
    const userId = 'mock-user';
    return this.vaultService.createIdea(userId, dto);
  }

  @Get('ideas')
  getIdea() {
    const userId = 'mock-user';
    return this.vaultService.getIdeas(userId);
  }

  @Get('ideas/:id')
  getIdeaById(@Param('id') id: string) {
    return this.vaultService.getIdeaById(id);
  }

  @Post('idea/:id/version')
  createVersion(@Param('id') ideaId: string, @Body() dto: CreateVersionDto) {
    return this.vaultService.createVersion(ideaId, dto);
  }
}
