import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { jwtConfig } from 'src/common/jwt.config';
import { MailModule } from 'src/mail/mail.module';
import { User, UserSchema } from '../models/user.model';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

/**
 * Authentication module.
 *
 * Registers the `User` schema and provides the `AuthService` and
 * `AuthController`. Also wires in the `JwtModule` and `MailModule`.
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register(jwtConfig),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
