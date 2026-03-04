import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { IdeaStudioService } from './idea-studio.service';
import { GenerateIdeaDto } from './dto/generate-idea.dto';

@UseGuards(JwtAuthGuard)
@Controller('idea-studio')
export class IdeaStudioController {
  constructor(private readonly service: IdeaStudioService) {}

  @Post('generate')
  generate(
    @Request() req: { user: { userId: string } },
    @Body() dto: GenerateIdeaDto,
  ) {
    return this.service.generate(req.user.userId, dto);
  }
}
