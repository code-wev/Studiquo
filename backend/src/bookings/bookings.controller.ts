import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MongoIdDto } from 'common/dto/mongoId.dto';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '../models/User.model';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, CreatePaymentLinkDto } from './dto/booking.dto';

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
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
  @Roles(UserRole.Student)
  async createBooking(@GetUser() user: any, @Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(user, dto);
  }

  /**
   * Create a payment link for an existing booking for a child.
   *
   * @param user - authenticated parent user
   * @param dto - DTO containing bookingId and studentId
   * @return payment link details
   */
  @Post('create-payment-link')
  @Roles(UserRole.Parent)
  async createPaymentLinkForBooking(
    @GetUser() user: any,
    @Body() dto: CreatePaymentLinkDto,
  ) {
    return this.bookingsService.createPaymentLinkForBooking(user, dto);
  }

  /**
   * Get all bookings for the authenticated student's children.
   *
   * @param user - authenticated student user
   * @return list of bookings for the student's children
   */
  @Get('children-bookings')
  @Roles(UserRole.Parent)
  async getChildrenBookings(
    @GetUser() user: any,
    @Query() pagination: PaginationDto,
  ) {
    return this.bookingsService.getChildrenBookings(user, pagination);
  }

  /**
   * Get all upcoming bookings for the authenticated student.
   *
   * @param user - authenticated student user
   * @return list of upcoming bookings for the student
   */
  @Get('my-upcoming-bookings')
  @Roles(UserRole.Student)
  async myUpcomingBookings(@GetUser() user: any) {
    return this.bookingsService.getMyUpcomingBookings(user);
  }

  /**
   * Get all bookings for the authenticated tutor.
   *
   * @param user - authenticated tutor user
   * @return list of bookings for the tutor
   */
  @Get('tutor-bookings')
  @Roles(UserRole.Tutor)
  async tutorBookings(@GetUser() user: any) {
    return this.bookingsService.getTutorBookings(user);
  }

  /**
   * Cancel a booking by its ID.
   *
   * @param bookingId - ID of the booking to cancel
   * @param user - authenticated user performing the cancellation
   * @return updated booking with status CANCELLED
   */
  @Put(':bookingId/cancel')
  @Roles(UserRole.Student)
  async cancelBooking(
    @Param('bookingId') bookingId: MongoIdDto['id'],
    @GetUser() user: any,
  ) {
    return this.bookingsService.cancelBooking(bookingId, user);
  }
}
