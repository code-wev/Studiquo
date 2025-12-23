import { Type } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { PaginationDto } from './../../../common/dto/pagination.dto';

export class CreateReviewDto {
  @IsMongoId()
  @IsOptional()
  booking?: string;

  @IsMongoId()
  tutor: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'Rating must be a number between 1 and 5' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating cannot be greater than 5' })
  rating: number;

  @IsString({ message: 'Comment must be a string' })
  @IsNotEmpty({ message: 'Comment is required' })
  @MinLength(1, { message: 'Comment must contain at least 1 character' })
  @MaxLength(1000, { message: 'Comment cannot exceed 1000 characters' })
  comment: string;
}

export class ReviewQueryDto extends PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;
}
