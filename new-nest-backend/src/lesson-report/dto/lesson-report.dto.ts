import {
  IsBoolean,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateLessonReportDto {
  @IsMongoId({ message: 'Booking id must be a valid Mongo id' })
  booking: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsDateString()
  @IsNotEmpty({
    message: 'Due date is required and must be a valid date string',
  })
  dueDate: Date;

  @IsOptional()
  @IsBoolean({ message: 'Submitted must be a boolean' })
  submitted?: boolean;
}

export class UpdateLessonReportDto {
  @IsOptional()
  @IsMongoId({ message: 'Booking id must be a valid Mongo id' })
  booking?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @IsOptional()
  @IsBoolean({ message: 'Submitted must be a boolean' })
  submitted?: boolean;
}
