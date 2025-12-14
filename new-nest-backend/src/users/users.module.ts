import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { jwtConfig } from 'src/common/jwt.config';
import { User, UserSchema } from '../models/user.model';
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
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register(jwtConfig),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
