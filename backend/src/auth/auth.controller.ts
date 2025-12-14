import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

/**
 * Authentication controller.
 *
 * Handles registration, login and password reset flows. Endpoints that
 * require an authenticated user are protected with `JwtAuthGuard`.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user with the provided details.
   *
   * @param body - registration data including email, password, etc.
   * @returns a success message on completion
   */
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  /**
   * Authenticate a user and return a JWT token.
   *
   * @param body - login data including email and password
   * @returns an object containing the JWT token
   */
  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  /**
   * Initiate the forgot-password flow by sending a reset link to email.
   *
   * @param body - object containing the user's email
   * @returns a generic success message
   */
  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body.email);
  }

  /**
   * Reset the user's password using a valid reset token.
   *
   * @param body - data containing email, new password and reset token
   * @returns a success message on completion
   */
  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body);
  }

  /**
   * Change the password for an authenticated user.
   *
   * @param req - the request object containing `user` set by the auth guard
   * @param body - data containing the new password
   * @returns a success message on completion
   */
  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Req() req, @Body() body: ChangePasswordDto) {
    return this.authService.changePassword(body);
  }
}
