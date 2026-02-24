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

  //Register logic
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

  //Login logic
  async login(dto: LoginDto) {
    const { email, password } = dto;
    const user = await this.userService.findUserbyEmail(email, true);

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid Credentials');
    }

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

  //Google Login
  async googleLogin(user: { email: string; name: string }) {
    if (!user) throw new UnauthorizedException();

    let existingUser = await this.userService.findUserbyEmail(user.email);

    if (!existingUser) {
      existingUser = await this.userService.createUsers(
        user.email,
        '', //No need for password due to Google Authentication
        user.name,
      );
    }

    const payload = {
      sub: existingUser.id,
      email: existingUser.email,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      id: existingUser.id,
      email: existingUser.email,
      access_token,
    };
  }
}
