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
import { MongoIdDto } from 'src/common/dto/mongoId.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role, Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student, Role.Tutor, Role.Parent, Role.Admin)
  async createBooking(@Req() req, @Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(req.user, dto);
  }

  @Put(':bookingId/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student, Role.Tutor, Role.Admin)
  async cancelBooking(@Param('bookingId') bookingId: MongoIdDto['id']) {
    return this.bookingsService.updateBookingStatus(bookingId, 'CANCELLED');
  }
  @Put(':bookingId/complete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Tutor, Role.Admin)
  async completeBooking(@Param('bookingId') bookingId: MongoIdDto['id']) {
    return this.bookingsService.updateBookingStatus(bookingId, 'COMPLETED');
  }

  @Get('my-bookings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student, Role.Tutor, Role.Parent, Role.Admin)
  async myBookings(@Req() req) {
    return this.bookingsService.getMyBookings(req.user);
  }

  @Get('my-schedule')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Tutor, Role.Admin)
  async mySchedule(@Req() req) {
    return this.bookingsService.getMySchedule(req.user);
  }

  @Get(':bookingId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student, Role.Tutor, Role.Parent, Role.Admin)
  async bookingDetails(@Param('bookingId') bookingId: MongoIdDto['id']) {
    return this.bookingsService.getBookingDetails(bookingId);
  }
}
