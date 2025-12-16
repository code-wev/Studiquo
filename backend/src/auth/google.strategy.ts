import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Model } from 'mongoose';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { User, UserRole } from '../models/user.model';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
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

      // If a redirect URL was provided when initiating auth, it will be
      // available as the `state` query parameter. Use it to redirect after
      // successful authentication.
      const state = req?.query?.state as string | undefined;

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
          role: UserRole.Student,
        });
        await user.save();
      } else if (!user.googleId) {
        user.googleId = id;
        await user.save();
      }

      const payload = {
        sub: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      };

      const token = this.jwtService.sign(payload);

      const frontend = state
        ? decodeURIComponent(state)
        : process.env.FRONTEND_URL;

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
