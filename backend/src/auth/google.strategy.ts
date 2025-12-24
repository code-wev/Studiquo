import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Model } from 'mongoose';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { MailService } from '../mail/mail.service';
import { User, UserRole } from '../models/User.model';

const ALLOWED_GOOGLE_ROLES = [
  UserRole.Student,
  UserRole.Tutor,
  UserRole.Parent,
] as const;

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        `${process.env.BACKEND_URL || 'http://localhost:8080'}/api/auth/google/callback`,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  // With `passReqToCallback: true` the first parameter is `req`
  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    try {
      const { id, name, emails, photos } = profile;
      const email = emails && emails[0] && emails[0].value;

      // If a redirect URL and role were provided when initiating auth, they
      // will be available as the `state` query parameter (JSON encoded).
      const state = req?.query?.state as string | undefined;
      let requestedRole: string | undefined;
      let redirectUrl: string | undefined;
      if (state) {
        try {
          const parsed = JSON.parse(decodeURIComponent(state));
          requestedRole = parsed?.role;
          redirectUrl = parsed?.redirect;
        } catch (err) {
          // malformed state
        }
      }

      // Role is required from the frontend. If missing or invalid, reject.
      if (!requestedRole) {
        return done(new UnauthorizedException('Role is required'), false);
      }
      if (!ALLOWED_GOOGLE_ROLES.includes(requestedRole as any)) {
        return done(new UnauthorizedException('Invalid role'), false);
      }

      let user = await this.userModel
        .findOne({ $or: [{ googleId: id }, { email }] })
        .exec();

      if (!user) {
        user = new this.userModel({
          googleId: id,
          email,
          firstName: (name && name.givenName) || '',
          lastName: (name && name.familyName) || '',
          avatar: photos && photos[0] && photos[0].value,
          password: '',
          role: requestedRole as UserRole,
        });
        await user.save();

        await this.mailService.sendWelcomeEmail(
          user.email,
          `${user.firstName} ${user.lastName}`,
        );
      } else {
        // If the user exists but their role doesn't match the requested role,
        // reject to prevent accidental privilege escalation or mismatched
        // account types.
        if (user.role !== (requestedRole as UserRole)) {
          return done(new UnauthorizedException('Role mismatch'), false);
        }
        if (!user.googleId) {
          user.googleId = id;
          await user.save();
        }
      }

      if (user.role === UserRole.Tutor && !user.isApproved) {
        return done(
          new UnauthorizedException('Tutor profile not approved yet'),
          false,
        );
      }

      const payload = {
        sub: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      };

      const token = this.jwtService.sign(payload);

      const frontend = redirectUrl || process.env.FRONTEND_URL;

      done(null, {
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
        token,
        redirect: frontend,
      });
    } catch (err) {
      done(err, false);
    }
  }
}
