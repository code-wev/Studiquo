import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

/**
 * Guard that verifies a Bearer JWT from the `Authorization` header.
 *
 * On successful verification the decoded payload is attached to
 * `request.user` for downstream handlers and guards.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  /**
   * Determine if the request contains a valid JWT and attach payload.
   *
   * @param context - execution context provided by Nest
   * @returns boolean indicating whether the request is authenticated
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];
    if (!authHeader) return false;
    const token = authHeader.replace('Bearer ', '');
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'your_jwt_secret',
      });
      request['user'] = payload;
      return true;
    } catch {
      return false;
    }
  }
}
