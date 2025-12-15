import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MongoIdDto } from 'common/dto/mongoId.dto';
import { UserRole } from 'src/models/user.model';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Student, UserRole.Tutor, UserRole.Parent, UserRole.Admin)
  async createBooking(@Req() req, @Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(req.user, dto);
  }

  @Put(':bookingId/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Student, UserRole.Tutor, UserRole.Admin)
  async cancelBooking(@Param('bookingId') bookingId: MongoIdDto['id']) {
    return this.bookingsService.updateBookingStatus(bookingId, 'CANCELLED');
  }
  @Put(':bookingId/complete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Tutor, UserRole.Admin)
  async completeBooking(@Param('bookingId') bookingId: MongoIdDto['id']) {
    return this.bookingsService.updateBookingStatus(bookingId, 'COMPLETED');
  }

  @Get('my-bookings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Student, UserRole.Tutor, UserRole.Parent, UserRole.Admin)
  async myBookings(@Req() req) {
    return this.bookingsService.getMyBookings(req.user);
  }

  @Get('my-schedule')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Tutor, UserRole.Admin)
  async mySchedule(@Req() req) {
    return this.bookingsService.getMySchedule(req.user);
  }

  @Get(':bookingId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Student, UserRole.Tutor, UserRole.Parent, UserRole.Admin)
  async bookingDetails(@Param('bookingId') bookingId: MongoIdDto['id']) {
    return this.bookingsService.getBookingDetails(bookingId);
  }
}
