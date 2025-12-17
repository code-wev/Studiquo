import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { ResponseInterceptor } from '../common/response.interceptor';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

/**
 * Bootstrap and start the Nest application.
 *
 * This function configures global guards, validation pipes, interceptors,
 * and application prefixing before starting the HTTP server. It also
 * attempts to ensure a default admin user exists on startup.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);

  /* PUBLIC CORS */
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Register `JwtAuthGuard` globally first so `request.user` is populated by
  // Passport/JWT before `RolesGuard` runs. Then register `RolesGuard`.
  const jwtGuard = app.get(JwtAuthGuard);
  app.useGlobalGuards(jwtGuard, new RolesGuard(reflector));

  // Set a global API prefix so all routes are prefixed with `/api`.
  app.setGlobalPrefix('api');

  // Enable CORS for the frontend and allow credentials so cookies are sent
  // across origins (frontend must send requests with `credentials: 'include'`).
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Enable global validation pipe with strict options:
  // - `whitelist` removes unexpected properties
  // - `forbidNonWhitelisted` throws on unexpected properties
  // - `transform` enables DTO transformation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global response formatting (wraps responses into a consistent shape).
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(process.env.PORT ?? 8080);

  const logger = new Logger('Bootstrap');
  try {
    // Ensure a default admin user exists; the service exposes `ensureAdminExists`.
    const usersService = app.get(UsersService);
    if (usersService && typeof usersService.ensureAdminExists === 'function') {
      await usersService.ensureAdminExists();
      logger.log('Admin user check completed');
    }
  } catch (err) {
    logger.error('Error ensuring default admin user', err);
  }

  console.log(`App running at port ${process.env.PORT ?? 3000}`);
}

void bootstrap();
