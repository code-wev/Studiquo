import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'common/decorators/get-user.decorator';
import { MongoIdDto } from 'common/dto/mongoId.dto';
import { SearchDto } from 'common/dto/search.dto';
import * as multer from 'multer';
import { UserRole } from 'src/models/User.model';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import {
  RespondToParentRequestDto,
  UpdatePasswordDto,
  UpdateProfileDto,
} from './dto/user.dto';
import { UsersService } from './users.service';

/**
 * Controller responsible for user-profile related endpoints.
 *
 * Routes are prefixed with `/users` and protected where appropriate
 * using JWT and role-based guards.
 */
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
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
  @UseInterceptors(
    FileInterceptor('avatar', { storage: multer.memoryStorage() }),
  )
  @Roles(UserRole.Student, UserRole.Tutor, UserRole.Parent, UserRole.Admin)
  async updateMe(
    @GetUser() user: any,
    @Body() body: UpdateProfileDto,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    return this.usersService.updateMe(user, body, avatar);
  }

  /**
   * Add a child (student) to the current authenticated parent user's profile.
   *
   * @param req - the request object containing `user` set by the auth guard
   * @param body - object containing the `studentId` of the child to add
   * @returns the updated parent user document (without password)
   */
  @Post('my/children')
  @Roles(UserRole.Parent)
  async addMyChild(
    @GetUser() user: any,
    @Body('studentId') studentId: MongoIdDto['id'],
  ) {
    return this.usersService.addChildToParent(user.userId, studentId);
  }

  /**
   * Search students (for parents) by query (studentId, name or email).
   *
   * @param req - the request object containing `user` set by the auth guard
   * @param search - the search query string
   * @returns array of matching student user documents (without passwords)
   */
  @Get('children/search')
  @Roles(UserRole.Parent)
  async searchChildren(@GetUser() user: any, @Query() { search }: SearchDto) {
    return this.usersService.searchStudentsForParent(user.userId, search);
  }

  /**
   * Parent: list connected children (students).
   *
   * @param req - the request object containing `user` set by the auth guard
   * @returns array of student user documents who are children of the parent
   */
  @Get('my/children')
  @Roles(UserRole.Parent)
  async listChildren(@GetUser() user: any) {
    return this.usersService.listChildrenOfParent(user.userId);
  }

  /**
   * Student: list connected parents.
   *
   * @param req - the request object containing `user` set by the auth guard
   * @returns array of parent user documents who are connected to the student
   */
  @Get('my/parents')
  @Roles(UserRole.Student)
  async listParents(@GetUser() user: any) {
    return this.usersService.listParentsOfStudent(user.userId);
  }

  /**
   * Student: list pending parent requests
   *
   * @param req - the request object containing `user` set by the auth guard
   * @returns array of parent user documents who have requested to be added as a parent
   */
  @Get('me/children/requests')
  @Roles(UserRole.Student)
  async listPendingRequests(@GetUser() user: any) {
    return this.usersService.listPendingParentRequests(user.userId);
  }

  /**
   * Student: respond to a parent request (accept/decline)
   *
   * @param req - the request object containing `user` set by the auth guard
   * @param parentId - the id of the parent sending the request
   * @param body - object containing `accept` boolean to accept or decline
   * @returns the updated student user document (without password)
   */
  @Post('me/children/requests/:parentId/respond')
  @Roles(UserRole.Student)
  async respondToParentRequest(
    @GetUser() user: any,
    @Param('parentId') parentId: MongoIdDto['id'],
    @Body() body: RespondToParentRequestDto,
  ) {
    return this.usersService.respondToParentRequest(
      user.userId,
      parentId,
      body.accept,
    );
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
  @Roles(UserRole.Student, UserRole.Tutor, UserRole.Parent, UserRole.Admin)
  async updatePassword(@GetUser() user: any, @Body() body: UpdatePasswordDto) {
    return this.usersService.updatePassword(user, body);
  }
}
