import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString({ message: 'Message must be a string' })
  @IsNotEmpty({ message: 'Message is required' })
  message: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  title?: string;
}
