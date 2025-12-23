import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import * as express from 'express';
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

  // Use raw body for Stripe webhook endpoint so signature verification works.
  // The app has a global prefix of `/api` so the webhook path is `/api/payments/webhook`.
  app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

  // Simple health-check endpoint at `/health`
  app.use('/health', (_, res) => {
    res.status(200).send({ status: 'ok' });
  });

  // Ensure consistent CORS headers for all responses (useful on serverless hosts)
  app.use(
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const origin = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header(
        'Access-Control-Allow-Methods',
        'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      );
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      );
      if (req.method === 'OPTIONS') return res.sendStatus(204);
      next();
    },
  );

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

  console.log(`App running at port ${process.env.PORT ?? 8080}`);
}

void bootstrap();
