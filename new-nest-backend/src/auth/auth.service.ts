import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MailService } from 'src/common/mail.service';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { User } from '../models/user.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private mailService?: MailService,
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

  async logout(user: any) {
    // JWT logout is stateless; implement blacklist if needed
    return { message: 'Logged out' };
  }

  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) return { message: 'If the email exists, a reset link will be sent' };

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?email=${encodeURIComponent(
      email,
    )}`;

    const mailOptions = {
      from: process.env.MAIL_FROM || 'no-reply@example.com',
      to: email,
      subject: 'Password reset',
      text: `Click the link to reset your password: ${resetLink}`,
      html: `<p>Click the link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
    };

    if (this.mailService) {
      await this.mailService.enqueue(mailOptions);
      return { message: 'Password reset link queued for sending' };
    }

    return { message: 'Mail service unavailable' };
  }

  async resetPassword(data: any) {
    const user = await this.userModel.findOne({ email: data.email });
    if (!user) throw new UnauthorizedException('User not found');
    user.password = await bcrypt.hash(data.newPassword, 10);
    await user.save();
    return { message: 'Password reset successful' };
  }
}
