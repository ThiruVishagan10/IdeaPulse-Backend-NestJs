import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { IdeaVaultService } from './idea-vault.service';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { CreateVersionDto } from './dto/create-version.dto';

@Controller('idea-vault')
export class IdeaVaultController {
  constructor(private readonly vaultService: IdeaVaultService) {}

  @Post('ideas')
  async createIdea(@Body() dto: CreateIdeaDto) {
    // Get first user from database for testing
    const user = await this.vaultService['prisma'].user.findFirst();
    if (!user) {
      throw new Error('No users found. Please register a user first.');
    }
    return this.vaultService.createIdea(user.id, dto);
  }

  @Get('ideas')
  async getIdea() {
    const user = await this.vaultService['prisma'].user.findFirst();
    if (!user) {
      throw new Error('No users found. Please register a user first.');
    }
    return this.vaultService.getIdeas(user.id);
  }

  @Get('ideas/:id')
  getIdeaById(@Param('id') id: string) {
    return this.vaultService.getIdeaById(id);
  }

  @Post('ideas/:id/version')
  createVersion(@Param('id') ideaId: string, @Body() dto: CreateVersionDto) {
    return this.vaultService.createVersion(ideaId, dto);
  }
}
