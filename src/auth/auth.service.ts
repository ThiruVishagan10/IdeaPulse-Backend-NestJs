import { Injectable, BadRequestException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '@/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const { email, password, name } = dto;
    const existingUser = await this.userService.findUserbyEmail(email);
    if (existingUser) {
      throw new BadRequestException('User already Exist');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userService.createUsers(
      email,
      hashedPassword,
      name,
    );
    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      access_token,
      message: 'Registration Successful',
    };
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;
    const user = await this.userService.findUserbyEmail(email, true);

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      access_token,
      message: 'Login Successful',
    };
  }
}
