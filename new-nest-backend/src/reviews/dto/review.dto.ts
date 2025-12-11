import { IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  booking: string;

  @IsString()
  student: string;

  @IsString()
  tutor: string;

  @IsNumber()
  rating: number;

  @IsString()
  comment: string;
}
