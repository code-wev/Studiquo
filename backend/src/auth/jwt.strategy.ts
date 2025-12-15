import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConfig } from 'common/jwt.config';

interface JwtPayload {
  sub: string;
  email: string;
  role?: string;
  isEmployerApproved?: boolean;
  isBlocked?: boolean;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Cast to `string` because `jwtConfig.secret` is typed as `Secret`
      // which may include `KeyObject`; Passport expects `string | Buffer`.
      secretOrKey: jwtConfig.secret as string,
    });
  }

  async validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      isEmployerApproved: payload.isEmployerApproved,
      isBlocked: payload.isBlocked,
    };
  }
}
