import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { GetUser } from 'common/decorators/get-user.decorator';
import { MongoIdDto } from 'common/dto/mongoId.dto';
import { UserRole } from 'src/models/user.model';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
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
  @Roles(UserRole.Student, UserRole.Tutor, UserRole.Parent, UserRole.Admin)
  async getMe(@GetUser() user: any) {
    return this.usersService.getMe(user.userId);
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
  @Roles(UserRole.Student, UserRole.Tutor, UserRole.Parent, UserRole.Admin)
  async updateMe(@GetUser() user: any, @Body() body: UpdateProfileDto) {
    return this.usersService.updateMe(user, body);
  }

  /**
   * Add a child (student) to the current authenticated parent user's profile.
   *
   * @param req - the request object containing `user` set by the auth guard
   * @param body - object containing the `studentId` of the child to add
   * @returns the updated parent user document (without password)
   */
  @Post('me/children')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Parent)
  async addChild(@GetUser() user: any, @Body() studentId: MongoIdDto['id']) {
    return this.usersService.addChildToParent(user.userId, studentId);
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
  @Roles(UserRole.Student, UserRole.Tutor, UserRole.Parent, UserRole.Admin)
  async updatePassword(@GetUser() user: any, @Body() body) {
    return this.usersService.updatePassword(user, body);
  }
}
