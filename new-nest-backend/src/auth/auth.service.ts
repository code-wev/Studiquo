import { Injectable, UnauthorizedException } from '@nestjs/common';
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
    // Implement mailing logic with node-cron (stub)
    return { message: 'Password reset link sent (stub)' };
  }

  async resetPassword(data: any) {
    const user = await this.userModel.findOne({ email: data.email });
    if (!user) throw new UnauthorizedException('User not found');
    user.password = await bcrypt.hash(data.newPassword, 10);
    await user.save();
    return { message: 'Password reset successful' };
  }
}
