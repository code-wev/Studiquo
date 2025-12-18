import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'common/decorators/get-user.decorator';
import { UserRole } from 'src/models/user.model';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/booking.dto';

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Student)
export class BookingsController {
  /**
   * BookingsController
   *
   * Handles student booking routes. Protected by JWT and role guards;
   * only users with the `Student` role may create bookings.
   */
  constructor(private readonly bookingsService: BookingsService) {}

  /**
   * Create a new booking and return payment redirect info.
   *
   * @user - authenticated student user
   * @dto - booking details (timeSlot, subject, type)
   * The service will create the booking (PENDING) and return a
   * Stripe Checkout URL to complete payment.
   */
  @Post()
  async createBooking(@GetUser() user: any, @Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(user, dto);
  }

  // @Put(':bookingId/cancel')
  // @Roles(UserRole.Student, UserRole.Tutor, UserRole.Admin)
  // async cancelBooking(@Param('bookingId') bookingId: MongoIdDto['id']) {
  //   return this.bookingsService.updateBookingStatus(bookingId, 'CANCELLED');
  // }

  // @Put(':bookingId/complete')
  // @Roles(UserRole.Tutor, UserRole.Admin)
  // async completeBooking(@Param('bookingId') bookingId: MongoIdDto['id']) {
  //   return this.bookingsService.updateBookingStatus(bookingId, 'COMPLETED');
  // }

  // @Get('my-bookings')
  // @Roles(UserRole.Student, UserRole.Tutor, UserRole.Parent)
  // async myBookings(@GetUser() user: any) {
  //   return this.bookingsService.getMyBookings(user);
  // }

  // @Get('my-schedule')
  // @Roles(UserRole.Tutor)
  // async mySchedule(@GetUser() user: any) {
  //   return this.bookingsService.getMySchedule(user);
  // }

  // @Get(':bookingId')
  // @Roles(UserRole.Student, UserRole.Tutor, UserRole.Parent)
  // async bookingDetails(@Param('bookingId') bookingId: MongoIdDto['id']) {
  //   return this.bookingsService.getBookingDetails(bookingId);
  // }
}
