import { Controller, Get, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from '@/users/users.service';

@Controller('test')
export class TestController {
  constructor(
    private prisma: PrismaService,
    private userService: UsersService,
  ) {}

  @Get('find-user')
  async findUser() {
    return this.userService.findUserbyEmail('thiruvishagan10@gmail.com');
  }

  @Post('create-user')
  async createUser() {
    return this.userService.createUsers(
      'thiruvishagan10@gmail.com',
      'Password@123',
      'Thiru',
    );
  }
}
