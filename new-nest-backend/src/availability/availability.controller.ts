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
import {
  CreateAvailabilityDto,
  CreateTimeSlotDto,
  UpdateTimeSlotDto,
} from './dto/availability.dto';

@Controller('api/availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Tutor, Role.Admin)
  async addAvailability(@Req() req, @Body() dto: CreateAvailabilityDto) {
    return this.availabilityService.addAvailability(req.user, dto);
  }

  @Post(':availabilityId/slots')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Tutor, Role.Admin)
  async addTimeSlot(
    @Param('availabilityId') availabilityId: string,
    @Body() dto: CreateTimeSlotDto,
  ) {
    return this.availabilityService.addTimeSlot(availabilityId, dto);
  }

  @Put('slots/:slotId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Tutor, Role.Admin)
  async updateSlot(
    @Param('slotId') slotId: string,
    @Body() dto: UpdateTimeSlotDto,
  ) {
    return this.availabilityService.updateSlot(slotId, dto);
  }

  @Delete('slots/:slotId')
  @UseGuards(JwtAuthGuard)
  async deleteSlot(@Param('slotId') slotId: string) {
    return this.availabilityService.deleteSlot(slotId);
  }
}
