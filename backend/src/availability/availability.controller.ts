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
import { MongoIdDto } from 'src/common/dto/mongoId.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role, Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AvailabilityService } from './availability.service';
import {
  CreateAvailabilityDto,
  CreateTimeSlotDto,
  UpdateTimeSlotDto,
} from './dto/availability.dto';

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
   * Add availability dates for the authenticated tutor.
   *
   * @param req - the request object containing `user` set by the auth guard
   * @param dto - data containing availability dates to add
   * @returns the created TutorAvailability document
   */
  @Post('date')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Tutor)
  async addAvailability(@Req() req, @Body() dto: CreateAvailabilityDto) {
    return this.availabilityService.addAvailability(req, dto);
  }

  /**
   * Add a time slot to an existing availability entry.
   *
   * @param req - the request object containing `user` set by the auth guard
   * @param dto - data containing time slot details to add
   * @returns the created TimeSlot document
   */
  @Post('slot')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Tutor)
  async addTimeSlotForTutor(@Req() req, @Body() dto: CreateTimeSlotDto) {
    return this.availabilityService.addTimeSlotForTutor(req, dto);
  }

  /**
   * Add a time slot to a specific availability entry by ID.
   *
   * @param availabilityId - the ID of the availability entry
   * @param dto - data containing time slot details to add
   * @returns the created TimeSlot document
   */
  @Post(':availabilityId/slots')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Tutor)
  async addTimeSlot(
    @Param('availabilityId') availabilityId: MongoIdDto['id'],
    @Body() dto: CreateTimeSlotDto,
  ) {
    return this.availabilityService.addTimeSlot(availabilityId, dto);
  }

  /**
   * Update a time slot by ID.
   *
   * @param req - the request object containing `user` set by the auth guard
   * @param slotId - the ID of the time slot to update
   * @param dto - data containing time slot fields to update
   * @returns the updated TimeSlot document
   */
  @Put(':slotId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Tutor)
  async updateSlot(
    @Req() req,
    @Param('slotId') slotId: MongoIdDto['id'],
    @Body() dto: UpdateTimeSlotDto,
  ) {
    return this.availabilityService.updateSlot(req, slotId, dto);
  }

  /**
   * Delete a time slot by ID.
   *
   * @param req - the request object containing `user` set by the auth guard
   * @param slotId - the ID of the time slot to delete
   * @returns a success message on completion
   */
  @Delete(':slotId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Tutor)
  async deleteSlot(@Req() req, @Param('slotId') slotId: MongoIdDto['id']) {
    return this.availabilityService.deleteSlot(req, slotId);
  }
}
