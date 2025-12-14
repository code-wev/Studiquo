import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { MailService } from 'src/mail/mail.service';
import { User } from '../models/user.model';
import { ChangePasswordDto, ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto } from './dto/auth.dto';
export declare class AuthService {
    private userModel;
    private jwtService;
    private mailService;
    constructor(userModel: Model<User>, jwtService: JwtService, mailService: MailService);
    register(data: RegisterDto): Promise<{
        message: string;
    }>;
    login(data: LoginDto): Promise<{
        message: string;
        user: {
            firstName: string;
            lastName: string;
            email: string;
            role: string;
        };
        token: string;
    }>;
    forgotPassword(data: ForgotPasswordDto['email']): Promise<{
        message: string;
    }>;
    resetPassword(data: ResetPasswordDto): Promise<{
        message: string;
    }>;
    changePassword(data: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
