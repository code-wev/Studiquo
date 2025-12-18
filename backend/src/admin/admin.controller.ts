import { Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { MongoIdDto } from 'common/dto/mongoId.dto';
import { UserRole } from 'src/models/user.model';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(RolesGuard)
@Roles(UserRole.Admin)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  async getUsers() {
    return this.adminService.getUsers();
  }

  @Get('bookings')
  async getBookings() {
    return this.adminService.getBookings();
  }

  @Get('payments')
  async getPayments() {
    return this.adminService.getPayments();
  }

  @Get('payouts')
  async getPayouts() {
    return this.adminService.getPayouts();
  }

  @Put('payouts/:payoutId/approve')
  async approvePayout(@Param('payoutId') payoutId: MongoIdDto['id']) {
    return this.adminService.updatePayoutStatus(payoutId, 'approved');
  }

  @Put('payouts/:payoutId/reject')
  async rejectPayout(@Param('payoutId') payoutId: MongoIdDto['id']) {
    return this.adminService.updatePayoutStatus(payoutId, 'rejected');
  }

  @Put('tutors/:tutorId/verify')
  async verifyTutor(@Param('tutorId') tutorId: MongoIdDto['id']) {
    return this.adminService.verifyTutor(tutorId);
  }
}
