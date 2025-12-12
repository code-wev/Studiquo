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
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student, Role.Tutor, Role.Parent, Role.Admin)
  async getMe(@Req() req: { user: any }) {
    return this.usersService.getMe(req.user);
  }

  @Put('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student, Role.Tutor, Role.Parent, Role.Admin)
  async updateMe(@Req() req: { user: any }, @Body() body) {
    return this.usersService.updateMe(req.user, body);
  }

  @Post('me/avatar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student, Role.Tutor, Role.Parent, Role.Admin)
  async uploadAvatar(
    @Req() req: { user: any },
    @Body('avatar') avatar: string,
  ) {
    return this.usersService.uploadAvatar(req.user, avatar);
  }

  @Put('me/password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student, Role.Tutor, Role.Parent, Role.Admin)
  async updatePassword(@Req() req: { user: any }, @Body() body) {
    return this.usersService.updatePassword(req.user, body);
  }
}
