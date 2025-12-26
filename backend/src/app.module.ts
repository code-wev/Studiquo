import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AvailabilityModule } from './availability/availability.module';
import { BookingsModule } from './bookings/bookings.module';
import { ChatModule } from './chat/chat.module';
import { ExamBoardModule } from './exam-board/exam-board.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PaymentsModule } from './payments/payments.module';
import { ReviewsModule } from './reviews/reviews.module';
import { TutorsModule } from './tutors/tutors.module';
import { UsersModule } from './users/users.module';

/**
 * Root application module.
 *
 * Registers global configuration, connects to MongoDB via Mongoose,
 * and imports feature modules for the application.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/lsm',
    ),
    AdminModule,
    AuthModule,
    AvailabilityModule,
    BookingsModule,
    ChatModule,
    ExamBoardModule,
    NotificationsModule,
    PaymentsModule,
    ReviewsModule,
    TutorsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
