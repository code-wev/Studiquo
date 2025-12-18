import { Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { MongoIdDto } from 'common/dto/mongoId.dto';
import { UserRole } from 'src/models/user.model';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @Roles(UserRole.Admin)
  async getUsers() {
    return this.adminService.getUsers();
  }

  @Get('bookings')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin)
  async getBookings() {
    return this.adminService.getBookings();
  }

  @Get('payments')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin)
  async getPayments() {
    return this.adminService.getPayments();
  }

  @Get('payouts')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin)
  async getPayouts() {
    return this.adminService.getPayouts();
  }

  @Put('payouts/:payoutId/approve')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin)
  async approvePayout(@Param('payoutId') payoutId: MongoIdDto['id']) {
    return this.adminService.updatePayoutStatus(payoutId, 'approved');
  }

  @Put('payouts/:payoutId/reject')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin)
  async rejectPayout(@Param('payoutId') payoutId: MongoIdDto['id']) {
    return this.adminService.updatePayoutStatus(payoutId, 'rejected');
  }

  @Put('tutors/:tutorId/verify')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin)
  async verifyTutor(@Param('tutorId') tutorId: MongoIdDto['id']) {
    return this.adminService.verifyTutor(tutorId);
  }
}
