import {
  IsBoolean,
  IsDateString,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateLessonReportDto {
  @IsMongoId()
  booking: string;

  @IsString()
  description: string;

  @IsDateString()
  dueDate: Date;

  @IsOptional()
  @IsBoolean()
  submitted?: boolean;
}

export class UpdateLessonReportDto {
  @IsOptional()
  @IsMongoId()
  booking?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @IsOptional()
  @IsBoolean()
  submitted?: boolean;
}
