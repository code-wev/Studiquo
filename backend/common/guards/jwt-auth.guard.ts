import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const url: string = req?.originalUrl || req?.url || '';

    // Allow unauthenticated access to specific auth endpoints so the
    // OAuth flow and login/register routes are reachable even though the
    // guard is applied globally in `main.ts`.
    const publicAuthPaths = [
      '/api/auth/google',
      '/api/auth/google/callback',
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/forgot-password',
      '/api/auth/reset-password',
    ];

    // Allow public access to certain endpoints
    const publicPaths = ['/api', '/api/', '/api/tutors'];

    if (publicPaths.some((p) => url.startsWith(p))) {
      return true;
    }

    if (publicAuthPaths.some((p) => url.startsWith(p))) {
      return true;
    }

    return super.canActivate(context);
  }
}
