import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role, Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AvailabilityService } from './availability.service';
import { CreateTimeSlotDto, UpdateTimeSlotDto } from './dto/availability.dto';

/**
 * Controller for managing tutor availability and time slots.
 *
 * Routes are prefixed with `/availability` and protected using JWT and
 * role-based guards where appropriate.
 */
@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  /**
   * Add a new time slot for the authenticated tutor.
   *
   * @param req - the request object containing `user` set by the auth guard
   * @param dto - timeslot DTO containing start/end times and optional meet link
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Tutor)
  async addTimeSlotForTutor(@Req() req, @Body() dto: CreateTimeSlotDto) {
    return this.availabilityService.addTimeSlotForTutor(req.user, dto);
  }

  /**
   * Create a timeslot under a specific availability document.
   * Kept for compatibility when availability id is known.
   *
   * @param availabilityId - id of the TutorAvailability document
   * @param dto - timeslot DTO containing start/end times and optional meet link
   */
  @Post(':availabilityId/slots')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Tutor)
  async addTimeSlot(
    @Param('availabilityId') availabilityId: string,
    @Body() dto: CreateTimeSlotDto,
  ) {
    return this.availabilityService.addTimeSlot(availabilityId, dto);
  }

  /**
   * Update an existing time slot by its id.
   *
   * @param slotId - id of the TimeSlot document to update
   * @param dto - DTO containing fields to update
   */
  @Put(':slotId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Tutor)
  async updateSlot(
    @Param('slotId') slotId: string,
    @Body() dto: UpdateTimeSlotDto,
  ) {
    return this.availabilityService.updateSlot(slotId, dto);
  }

  /**
   * Delete a time slot by its id.
   *
   * @param slotId - id of the TimeSlot document to delete
   */
  @Delete(':slotId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Tutor)
  async deleteSlot(@Param('slotId') slotId: string) {
    return this.availabilityService.deleteSlot(slotId);
  }
}
