import { IsMongoId, IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsMongoId()
  booking: string;

  @IsMongoId()
  student: string;

  @IsMongoId()
  tutor: string;

  @IsNumber()
  rating: number;

  @IsString()
  comment: string;
}
