import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { IdeasService } from './ideas.service';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { CreateVersionDto } from './dto/create-version.dto';

@UseGuards(JwtAuthGuard)
@Controller('ideas')
export class IdeasController {
  constructor(private readonly ideaService: IdeasService) {}

  @Post()
  create(
    @Request() req: { user: { userId: string } },
    @Body() dto: CreateIdeaDto,
  ) {
    return this.ideaService.create(req.user.userId, dto);
  }

  @Post(':id/version')
  addVersion(
    @Request() req: { user: { userId: string } },
    @Param('id') ideaId: string,
    @Body() dto: CreateVersionDto,
  ) {
    return this.ideaService.addVersion(req.user.userId, ideaId, dto);
  }

  @Get()
  findAll(
    @Request() req: { user: { userId: string } },
    @Query('page') page = 0,
  ) {
    return this.ideaService.findAll(req.user.userId, Number(page));
  }

  @Get(':id')
  findOne(
    @Request() req: { user: { userId: string } },
    @Param('id') ideaId: string,
  ) {
    return this.ideaService.findOne(req.user.userId, ideaId);
  }

  @Delete(':id')
  remove(
    @Request() req: { user: { userId: string } },
    @Param('id') ideaId: string,
  ) {
    return this.ideaService.softDelete(req.user.userId, ideaId);
  }
}
