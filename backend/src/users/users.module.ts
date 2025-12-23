import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { jwtConfig } from '../../common/jwt.config';
import { AwsService } from '../aws/aws.service';
import {
  StudentProfile,
  StudentProfileSchema,
} from '../models/StudentProfile.model';
import { TutorProfile, TutorProfileSchema } from '../models/TutorProfile.model';
import { User, UserSchema } from '../models/User.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

/**
 * Users feature module.
 *
 * Registers the Mongoose model for `User` and provides the
 * `UsersService` and `UsersController` to the application.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: TutorProfile.name, schema: TutorProfileSchema },
      { name: StudentProfile.name, schema: StudentProfileSchema },
    ]),
    JwtModule.register(jwtConfig),
  ],
  controllers: [UsersController],
  providers: [UsersService, AwsService],
  exports: [UsersService],
})
export class UsersModule {}
