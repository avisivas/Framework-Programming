import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CreateAuthDto } from './dto/create-auth.js';
import { ForgotPasswordDto } from './dto/forgot-password.js';
import { LoginAuthDto } from './dto/login-auth.js';
import { ResetPasswordDto } from './dto/reset-password.js';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() data: CreateAuthDto) {
    return this.authService.register(data);
  }

  @Post('login')
  login(@Body() data: LoginAuthDto) {
    return this.authService.login(data);
  }

  @Post('forgot-password')
  forgotPassword(@Body() data: ForgotPasswordDto) {
    return this.authService.forgotPassword(data);
  }

  @Put('reset-password/:token')
  resetPassword(
    @Param('token') token: string,
    @Body() data: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(token, data);
  }
}