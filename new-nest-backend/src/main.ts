import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { RolesGuard } from './auth/roles.guard';
import { ResponseInterceptor } from './common/response.interceptor';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new RolesGuard(reflector));
  app.setGlobalPrefix('api');
  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // Global response formatting
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(process.env.PORT ?? 3000);
  const logger = new Logger('Bootstrap');
  try {
    const usersService = app.get(UsersService);
    if (usersService && typeof usersService.ensureAdminExists === 'function') {
      await usersService.ensureAdminExists();
      logger.log('Admin user check completed');
    }
  } catch (err) {
    logger.error('Error ensuring default admin user', err as any);
  }

  console.log(`App running at port ${process.env.PORT ?? 3000}`);
}
void bootstrap();
