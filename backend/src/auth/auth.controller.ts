import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'common/decorators/get-user.decorator';
import passport from 'passport';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto/auth.dto';

/**
 * Authentication controller.
 *
 * Handles registration, login and password reset flows. Endpoints that
 * require an authenticated user are protected with `JwtAuthGuard`.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ----- Google OAuth routes -----
  @Get('google')
  async googleAuth(@Req() req: any, @Res() res: any) {
    // Require `role` from frontend. If not provided, return an error.
    const role = (req.query.role as string) || undefined;
    if (!role) {
      return res.status(400).json({ message: 'role is required' });
    }

    // Optional `redirect` query param will be passed through the OAuth state
    const redirect = (req.query.redirect as string) || process.env.FRONTEND_URL;

    // Encode both redirect and role into the OAuth state so the callback
    // can access them and enforce role-based registration.
    const stateObj = { redirect, role };
    const state = encodeURIComponent(JSON.stringify(stateObj));

    return passport.authenticate('google', {
      scope: ['email', 'profile'],
      state,
    })(req, res);
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: any, @Res() res: any) {
    // `req.user` is set by the Google strategy. It contains `{ user, token }`.
    const result = req.user;
    if (!result) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const token = result.token;
    const frontend = process.env.FRONTEND_URL;

    if (frontend && token) {
      const cleanFrontend = frontend.replace(/\/$/, '');
      const redirectUrl = `${cleanFrontend}/auth/success/${encodeURIComponent(
        token,
      )}`;
      return res.redirect(redirectUrl);
    }

    return res.json(result);
  }

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
   * @param user - the authenticated user object
   * @param body - data containing the new password
   * @returns a success message on completion
   */
  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@GetUser() user: any, @Body() body: ChangePasswordDto) {
    return this.authService.changePassword(user, body);
  }
}
