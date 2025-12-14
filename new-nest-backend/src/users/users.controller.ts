import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role, Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UpdateProfileDto } from './dto/user.dto';
import { UsersService } from './users.service';

/**
 * Controller responsible for user-profile related endpoints.
 *
 * Routes are prefixed with `/users` and protected where appropriate
 * using JWT and role-based guards.
 */
@Controller('users')
export class UsersController {
  /**
   * Create the `UsersController`.
   *
   * @param usersService - service that encapsulates user data operations
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * Retrieve the current authenticated user's profile (without password).
   *
   * @param req - the request object containing `user` set by the auth guard
   * @returns the user document excluding the password field
   */
  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student, Role.Tutor, Role.Parent, Role.Admin)
  async getMe(@Req() req: { user: any }) {
    return this.usersService.getMe(req.user);
  }

  /**
   * Update the current authenticated user's profile fields.
   *
   * @param req - the request object containing `user` set by the auth guard
   * @param body - partial user data to update
   * @returns the updated user document (without password)
   */
  @Put('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student, Role.Tutor, Role.Parent, Role.Admin)
  async updateMe(@Req() req: { user: any }, @Body() body: UpdateProfileDto) {
    return this.usersService.updateMe(req.user, body);
  }

  /**
   * Upload or set a user's avatar image reference.
   *
   * @param req - the request object containing `user` set by the auth guard
   * @param avatar - base64 string or storage key for the avatar image
   * @returns the updated user document (without password)
   */
  @Post('me/avatar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student, Role.Tutor, Role.Parent, Role.Admin)
  async uploadAvatar(
    @Req() req: { user: any },
    @Body('avatar') avatar: string,
  ) {
    return this.usersService.uploadAvatar(req.user, avatar);
  }

  /**
   * Update the current authenticated user's password.
   *
   * Expects an object with `newPassword` (and optionally `oldPassword`)
   * depending on the application's policy.
   *
   * @param req - the request object containing `user` set by the auth guard
   * @param body - data containing the new password
   * @returns a success message on completion
   */
  @Put('me/password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student, Role.Tutor, Role.Parent, Role.Admin)
  async updatePassword(@Req() req: { user: any }, @Body() body) {
    return this.usersService.updatePassword(req.user, body);
  }
}
