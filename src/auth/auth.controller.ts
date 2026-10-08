import { Body, Controller, Post, Put, Param } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto.js';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    register(@Body() registerdto: RegisterDto) {
        return this.authService.register(registerdto);
    }
    
    @Post('login')
    login(@Body() logindto: LoginDto) {
        return this.authService.login(logindto);
    }

    @Post('forgot-password')
    forgotPassword(@Body() forgotpassworddto: ForgotPasswordDto) {
        return this.authService.forgotPassword(forgotpassworddto);
    }

   @Put('reset-password/:token')
    resetPassword(
        @Param('token') token: string, 
        @Body() resetpassworddto: ResetPasswordDto
    ) {
        return this.authService.resetPassword(token, resetpassworddto);
    }
}