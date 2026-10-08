import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import { randomUUID } from 'crypto';
import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { UserService } from '../user/user.service.js';

@Injectable()
export class AuthService {
    constructor(private readonly userservice: UserService) {}

    register(registerdto: RegisterDto) {

        if (registerdto.password !== registerdto.confirmPassword) {
            throw new BadRequestException('Password dan confirm password tidak sama');
        }

        const existinguser = this.userservice.findByEmail(registerdto.email);

        if (existinguser) {
            throw new ConflictException('Email sudah digunakan');
        }

        return this.userservice.create({
            name: registerdto.name,
            email: registerdto.email,
            password: registerdto.password
        });
    }

    login(logindto: LoginDto) {
        const user = this.userservice.findByEmail(logindto.email);

        if (!user) {
            throw new UnauthorizedException('Email salah');
        }

        if (user.password !== logindto.password) {
            throw new UnauthorizedException('Password salah');
        }

        return {
            message: 'Login berhasil',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    }

    private resetTokens: {
        email: string;
        token: string;
    }[] = [];

    forgotPassword(forgotpassworddto: ForgotPasswordDto) {
        const user = this.userservice.findByEmail(forgotpassworddto.email);

        if (!user) {
            throw new UnauthorizedException('Email tidak ditemukan');
        }

        const token = randomUUID();

        this.resetTokens.push({
            email: user.email,
            token: token,
        });

        // logika mengirim Email 
        return {
            message: 'Token reset password berhasil dibuat',
            token: token,
        };
    }

    resetPassword(token: string, resetpassworddto: ResetPasswordDto) {

        if (resetpassworddto.newPassword !== resetpassworddto.confirmNewPassword) {
            throw new BadRequestException('Password dan confirm password tidak sama');
        }

        const tokenData = this.resetTokens.find(
            item => item.token === token
        );

        if (!tokenData) {
            throw new BadRequestException('Token tidak valid');
        }

        const user = this.userservice.findByEmail(tokenData.email);

        if (!user) {
            throw new NotFoundException('User tidak ditemukan');
        }

        this.userservice.update(
            user.id, { password: resetpassworddto.newPassword }
        );

        this.resetTokens = this.resetTokens.filter(
            item => item.token !== token
        );

        return {
            message: 'Password berhasil direset'
        };
    }
}