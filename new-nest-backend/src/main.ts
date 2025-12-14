import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { RolesGuard } from './auth/roles.guard';
import { ResponseInterceptor } from './common/response.interceptor';
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

  // Register the roles guard globally to protect role-restricted routes.
  app.useGlobalGuards(new RolesGuard(reflector));

  // Set a global API prefix so all routes are prefixed with `/api`.
  app.setGlobalPrefix('api');

  // Enable global validation pipe with strict options:
  // - `whitelist` removes unexpected properties
  // - `forbidNonWhitelisted` throws on unexpected properties
  // - `transform` enables DTO transformation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global response formatting (wraps responses into a consistent shape).
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(process.env.PORT ?? 3000);

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
