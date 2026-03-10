import { Module } from '@nestjs/common';
import { IdeaVaultController } from './idea-vault.controller';
import { IdeaVaultService } from './idea-vault.service';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [IdeaVaultController],
  providers: [IdeaVaultService],
  exports: [IdeaVaultService],
})
export class IdeaVaultModule {}
