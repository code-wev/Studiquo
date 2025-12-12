import { Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { Role, Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async getUsers() {
    return this.adminService.getUsers();
  }

  @Get('bookings')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async getBookings() {
    return this.adminService.getBookings();
  }

  @Get('payments')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async getPayments() {
    return this.adminService.getPayments();
  }

  @Get('payouts')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async getPayouts() {
    return this.adminService.getPayouts();
  }

  @Put('payouts/:payoutId/approve')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async approvePayout(@Param('payoutId') payoutId: string) {
    return this.adminService.updatePayoutStatus(payoutId, 'approved');
  }

  @Put('payouts/:payoutId/reject')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async rejectPayout(@Param('payoutId') payoutId: string) {
    return this.adminService.updatePayoutStatus(payoutId, 'rejected');
  }

  @Put('tutors/:tutorId/verify')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async verifyTutor(@Param('tutorId') tutorId: string) {
    return this.adminService.verifyTutor(tutorId);
  }
}
