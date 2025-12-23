import { Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { MongoIdDto } from 'common/dto/mongoId.dto';
import { UserRole } from 'src/models/User.model';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AdminService } from './admin.service';
import { AdminOverViewQueryDto } from './dto/admin.dto';

@Controller('admin')
@UseGuards(RolesGuard)
@Roles(UserRole.Admin)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * Get an overview of platform statistics including user counts and revenue.
   *
   * @param query - optional month and year for filtering revenue stats
   * @returns overview data including user counts and revenue breakdowns
   */
  @Get('overview')
  async getOverview(@Query() query: AdminOverViewQueryDto) {
    return this.adminService.getOverview(query);
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

  /**
   * Verify a tutor's profile by setting isApproved to true.
   *
   * @param tutorId - ID of the tutor profile to verify
   * @returns success message and updated tutor profile
   */
  @Put('tutors/:tutorId/verify')
  async verifyTutor(@Param('tutorId') tutorId: MongoIdDto['id']) {
    return this.adminService.verifyTutor(tutorId);
  }

  /**
   * Reject a tutor's profile by setting isApproved to false.
   *
   * @param tutorId - ID of the tutor profile to reject
   * @returns success message and updated tutor profile
   */
  @Put('tutors/:tutorId/reject')
  async rejectTutor(@Param('tutorId') tutorId: MongoIdDto['id']) {
    return this.adminService.rejectTutor(tutorId);
  }
}
