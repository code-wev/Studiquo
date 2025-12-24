import { Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { searchPaginationQueryDto } from 'common/dto/searchPagination.dto';
import { JwtAuthGuard } from 'common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { MongoIdDto } from '../../common/dto/mongoId.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '../models/User.model';
import { AdminService } from './admin.service';
import { AdminOverViewQueryDto } from './dto/admin.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
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

  /**
   * Get all registered payments.
   *
   * @returns list of payments with pagination
   */
  @Get('payments')
  async getPayments(@Query() query: searchPaginationQueryDto) {
    return this.adminService.getPayments(query);
  }

  /**
   * Get all registered payouts.
   *
   * @returns list of payouts
   */
  @Get('payouts')
  async getPayouts(@Query() query: searchPaginationQueryDto) {
    return this.adminService.getPayouts(query);
  }

  /**
   * Get all registered tutors.
   *
   * @returns list of tutors with their profiles
   */
  @Get('students')
  async getStudents(
    @Query() { search, page, limit }: searchPaginationQueryDto,
  ) {
    return this.adminService.getStudents(search, { page, limit });
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
