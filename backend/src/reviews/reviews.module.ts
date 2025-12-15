import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from '../models/review.model';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { jwtConfig } from 'src/common/jwt.config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    JwtModule.register(jwtConfig),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
