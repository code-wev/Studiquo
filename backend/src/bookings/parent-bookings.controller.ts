import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'common/decorators/get-user.decorator';
import { UserRole } from 'src/models/user.model';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { BookingsService } from './bookings.service';

@Controller('bookings/parent')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Parent)
export class ParentBookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('children')
  async childrenBookings(@GetUser() user: any) {
    return this.bookingsService.getChildrenBookings(user);
  }

  @Post(':bookingId/pay')
  async payForBooking(
    @GetUser() user: any,
    @Param('bookingId') bookingId: string,
  ) {
    return this.bookingsService.createPaymentLinkForBooking(user, bookingId);
  }
}
