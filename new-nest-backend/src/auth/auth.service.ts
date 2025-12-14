import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { MailService } from 'src/mail/mail.service';
import { User } from '../models/user.model';
import { ChangePasswordDto, ResetPasswordDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = new this.userModel({ ...data, password: hashedPassword });
    await user.save();
    return { message: 'Registration successful' };
  }

  async login(data: any) {
    const user = await this.userModel.findOne({ email: data.email });
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.jwtService.sign({ sub: user._id, role: user.role });
    return { token };
  }

 

  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user)
      return { message: 'If the email exists, a reset link will be sent' };

    // Generate a reset token with 5 min expiry
    const resetToken = this.jwtService.sign(
      { sub: user._id },
      { expiresIn: '5m' },
    );

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?email=${encodeURIComponent(
      email,
    )}&token=${resetToken}`;

    // Send mail using a mail utility
    await this.mailService.sendResetPasswordEmail(email, resetLink);

    return {
      message: 'Reset link sent to your email if it exists',
    };
  }

  async resetPassword(data: ResetPasswordDto) {
    const user = await this.userModel.findOne({
      email: data.email,
      token: data.token,
    });

    if (!user)
      throw new UnauthorizedException('User not found or session expired');
    user.password = await bcrypt.hash(data.newPassword, 10);
    await user.save();
    return { message: 'Password reset successful' };
  }

  async changePassword(data: ChangePasswordDto) {
    const user = await this.userModel.findById(data.userId);
    if (!user) throw new UnauthorizedException('User not found');
    if (!(await bcrypt.compare(data.oldPassword, user.password))) {
      throw new UnauthorizedException('Old password is incorrect');
    }
    user.password = await bcrypt.hash(data.newPassword, 10);
    await user.save();
    return { message: 'Password changed successfully' };
  }
}
