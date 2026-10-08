import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.js';
import { ForgotPasswordDto } from './dto/forgot-password.js';
import { LoginAuthDto } from './dto/login-auth.js';
import { ResetPasswordDto } from './dto/reset-password.js';
import { User } from './entities/auth-entity.js';

@Injectable()
export class AuthService {
  private users: User[] = [];
  private resetTokens = new Map<string, string>();

  register(data: CreateAuthDto) {
    if (data.password !== data.confirmPassword) {
      throw new BadRequestException('Password dan confirmPassword tidak sama');
    }

    const emailAlreadyUsed = this.users.some(user => user.email === data.email);
    if (emailAlreadyUsed) {
      throw new BadRequestException('Email sudah terdaftar');
    }

    const user: User = {
      id: this.users.length + 1,
      name: data.name,
      email: data.email,
      password: data.password,
    };

    this.users.push(user);

    return {
      message: 'Register berhasil',
      data: user,
    };
  }

  login(data: LoginAuthDto) {
    const user = this.users.find(
      item => item.email === data.email && item.password === data.password,
    );

    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    return {
      message: 'Login berhasil',
      data: user,
    };
  }

  forgotPassword(data: ForgotPasswordDto) {
    const user = this.users.find(item => item.email === data.email);
    if (!user) {
      throw new NotFoundException('Email tidak ditemukan');
    }

    const token = `reset-token-${user.id}`;
    this.resetTokens.set(token, user.email);

    return {
      message: 'Token reset password berhasil dibuat',
      token,
    };
  }

  resetPassword(token: string, data: ResetPasswordDto) {
    if (token !== data.token) {
      throw new BadRequestException('Token di URL dan body tidak sama');
    }

    if (data.newPassword !== data.confirmNewPassword) {
      throw new BadRequestException(
        'newPassword dan confirmNewPassword tidak sama',
      );
    }

    const email = this.resetTokens.get(token);
    if (!email) {
      throw new BadRequestException('Token tidak valid');
    }

    const user = this.users.find(item => item.email === email);
    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    user.password = data.newPassword;
    this.resetTokens.delete(token);

    return {
      message: 'Password berhasil direset',
      data: user,
    };
  }
}