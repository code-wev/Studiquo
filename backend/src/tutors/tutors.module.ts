import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AvailabilityModule } from 'src/availability/availability.module';
import { jwtConfig } from 'src/common/jwt.config';
import { Review, ReviewSchema } from 'src/models/review.model';
import { TutorProfile, TutorProfileSchema } from '../models/tutorProfile.model';
import { User, UserSchema } from '../models/user.model';
import { TutorsController } from './tutors.controller';
import { TutorsService } from './tutors.service';

/**
 * Tutors feature module.
 *
 * Registers the `TutorProfile`, `User` and `Review` schemas and
 * exposes the `TutorsService` and `TutorsController` for the app.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TutorProfile.name, schema: TutorProfileSchema },
      { name: User.name, schema: UserSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
    AvailabilityModule,
    JwtModule.register(jwtConfig),
  ],
  controllers: [TutorsController],
  providers: [TutorsService],
  exports: [TutorsService],
})
export class TutorsModule {}
