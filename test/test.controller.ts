import { Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from '@/users/users.service';

@Controller('test')
export class TestController {
  constructor(
    private prisma: PrismaService,
    private userService: UsersService,
  ) {}

  @Get('find-user')
  findUser() {
    return this.userService.findUserbyEmail('thiruvishagan10@gmail.com');
  }

  @Post('create-user')
  createUser() {
    return this.userService.createUsers(
      'thiruvishagan10@gmail.com',
      'Password@123',
      'Thiru',
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getTest(@Req() req: { user: { userId: string; email: string } }) {
    return {
      message: 'protected route works',
      user: req.user,
    };
  }
}
