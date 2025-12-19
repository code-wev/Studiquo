import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'common/decorators/get-user.decorator';
import { MongoIdDto } from 'common/dto/mongoId.dto';
import { UserRole } from 'src/models/User.model';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
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
@UseGuards(JwtAuthGuard, RolesGuard)
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
  @Roles(UserRole.Tutor)
  async addAvailability(
    @GetUser() user: any,
    @Body() dto: CreateAvailabilityDto,
  ) {
    return this.availabilityService.addAvailability(user, dto);
  }

  /**
   * Delete an availability entry by ID.
   *
   * @param req - the request object containing `user` set by the auth guard
   * @param availabilityId - the ID of the availability entry to delete
   * @returns a success message on completion
   */
  @Delete('date/:availabilityId')
  @Roles(UserRole.Tutor)
  async deleteAvailability(
    @GetUser() user: any,
    @Param('availabilityId') availabilityId: MongoIdDto['id'],
  ) {
    return this.availabilityService.deleteAvailability(user, availabilityId);
  }

  /**
   * Add a time slot to a specific availability entry by ID.
   *
   * @param availabilityId - the ID of the availability entry
   * @param dto - data containing time slot details to add
   * @returns the created TimeSlot document
   */
  @Post('date/:availabilityId/slots')
  @Roles(UserRole.Tutor)
  async addTimeSlot(
    @GetUser() user: any,
    @Param('availabilityId') availabilityId: MongoIdDto['id'],
    @Body() dto: CreateTimeSlotDto,
  ) {
    return this.availabilityService.addTimeSlot(user, availabilityId, dto);
  }

  /**
   * Update a time slot by ID.
   *
   * @param req - the request object containing `user` set by the auth guard
   * @param slotId - the ID of the time slot to update
   * @param dto - data containing time slot fields to update
   * @returns the updated TimeSlot document
   */
  @Put('slots/:slotId')
  @Roles(UserRole.Tutor)
  async updateSlot(
    @GetUser() user: any,
    @Param('slotId') slotId: MongoIdDto['id'],
    @Body() dto: UpdateTimeSlotDto,
  ) {
    return this.availabilityService.updateSlot(user, slotId, dto);
  }

  /**
   * Delete a time slot by ID.
   *
   * @param req - the request object containing `user` set by the auth guard
   * @param slotId - the ID of the time slot to delete
   * @returns a success message on completion
   */
  @Delete('slots/:slotId')
  @Roles(UserRole.Tutor)
  async deleteSlot(
    @GetUser() user: any,
    @Param('slotId') slotId: MongoIdDto['id'],
  ) {
    return this.availabilityService.deleteSlot(user, slotId);
  }
}
