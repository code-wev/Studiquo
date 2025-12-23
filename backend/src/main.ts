import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
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

  // Stripe webhook needs the raw body — register it before the JSON parser
  app.use(
    '/api/payments/webhook',
    bodyParser.raw({ type: 'application/json' }),
  );

  // Normal JSON parsing for all other routes
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Set a global API prefix so all routes are prefixed with `/api`.
  app.setGlobalPrefix('api');

  // Enable CORS for the frontend and allow credentials so cookies are sent
  // across origins (frontend must send requests with `credentials: 'include'`).
  const allowedOrigins = [
    'https://studiquo-frontend.herokuapp.com',
    'http://localhost:3000',
    'https://lazmina-frontend-test.vercel.app',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS not allowed for origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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

  // (Stripe webhook raw body middleware registered earlier)

  app.use('/health', (_, res) => {
    res.status(200).send({ status: 'ok' });
  });

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
