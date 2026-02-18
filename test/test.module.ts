import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [TestController],
})
export class TestModule {}
