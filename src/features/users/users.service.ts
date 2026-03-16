import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUsers(email: string, password: string, name: string) {
    return this.prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
  }

  async findUserbyEmail(email: string, includePassword = false) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        password: includePassword,
      },
    });
  }

  async findUserbyId(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}
