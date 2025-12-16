import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { MailService } from 'src/mail/mail.service';
import { User } from '../models/user.model';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  /**
   * AuthService handles registration, authentication and password flows.
   *
   * @param userModel - injected Mongoose model for `User`
   * @param jwtService - JWT signing and verification service
   * @param mailService - mail utility for sending transactional emails
   */
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  /**
   * Register a new user with the provided details.
   *
   * @param data - registration data including email, password, etc.
   * @returns a success message on completion
   */
  async register(data: RegisterDto) {
    const alreadyExists = await this.userModel.findOne({ email: data.email });
    if (alreadyExists) {
      throw new UnauthorizedException('Email already in use');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = new this.userModel({ ...data, password: hashedPassword });
    await user.save();
    await this.mailService.sendWelcomeEmail(
      user.email,
      `${user.firstName} ${user.lastName}`,
    );
    const token = this.jwtService.sign({
      sub: user._id,
      studentId: user.studentId || null,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    });
    return { message: 'Registration successful', token };
  }

  /**
   * Authenticate a user and return a JWT token.
   *
   * @param data - login data including email and password
   * @returns an object containing the JWT token
   */
  async login(data: LoginDto) {
    const user = await this.userModel.findOne({ email: data.email });
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.jwtService.sign({
      sub: user._id,
      studentId: user.studentId || null,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    });
    return {
      message: 'Login successful',
      token,
    };
  }

  /**
   * Initiate the forgot-password flow by sending a reset link to email.
   *
   * @param data - object containing the user's email
   * @returns a generic success message
   */
  async forgotPassword(data: ForgotPasswordDto['email']) {
    const user = await this.userModel.findOne({ email: data });
    if (!user)
      return { message: 'If the email exists, a reset link will be sent' };

    // Generate a reset token with 5 min expiry
    const resetToken = this.jwtService.sign({ sub: user._id });

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?email=${encodeURIComponent(
      data,
    )}&token=${resetToken}`;

    // Save the token and its expiry(5 min) to the user record
    user.token = resetToken;
    user.tokenExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    await user.save();

    // Send mail using a mail utility
    await this.mailService.sendResetPasswordEmail(data, resetLink);
    return {
      message: 'Reset link sent to your email if it exists',
    };
  }

  /**
   * Reset the user's password using a valid reset token.
   *
   * @param data - data containing email, new password and reset token
   * @returns a success message on completion
   */
  async resetPassword(data: ResetPasswordDto) {
    const user = await this.userModel.findOne({
      email: data.email,
      token: data.token,
    });

    // check the token is expired or not

    if (!user)
      throw new UnauthorizedException('User not found or session expired');

    if (!user.tokenExpiry || user.tokenExpiry < new Date()) {
      throw new UnauthorizedException('Reset token has expired');
    }

    user.password = await bcrypt.hash(data.newPassword, 10);
    user.token = '';
    user.tokenExpiry = undefined;
    await user.save();
    return { message: 'Password reset successful' };
  }

  /**
   * Change the password for an authenticated user.
   *
   * @param data - data containing the new password
   * @returns a success message on completion
   */
  async changePassword(user: any, data: ChangePasswordDto) {
    const existingUser = await this.userModel.findById(user._id);
    if (!existingUser) throw new UnauthorizedException('User not found');
    if (!(await bcrypt.compare(data.oldPassword, existingUser.password))) {
      throw new UnauthorizedException('Old password is incorrect');
    }
    existingUser.password = await bcrypt.hash(data.newPassword, 10);
    await existingUser.save();
    return { message: 'Password changed successfully' };
  }
}
