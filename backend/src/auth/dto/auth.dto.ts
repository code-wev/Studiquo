import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsEnum(['Tutor', 'Student', 'Parent'], {
    message: 'Role must be one of Tutor|Student|Parent',
  })
  role: string;

  @IsOptional()
  @IsString({ message: 'Bio must be a string' })
  bio?: string;

  @IsOptional()
  @IsString({ message: 'DBS must be a string' })
  dbsLink?: string;

  @IsOptional()
  @IsString({ message: 'Referral source must be a string' })
  referralSource?: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  password: string;
}

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;
}

export class ResetPasswordDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsString({ message: 'New password must be a string' })
  @MinLength(6, { message: 'New password must be at least 6 characters' })
  newPassword: string;

  @IsString({ message: 'Token is required' })
  token: string;
}

export class ChangePasswordDto {
  @IsMongoId({ message: 'User id must be a valid Mongo id' })
  userId: string;

  @IsString({ message: 'Old password must be a string' })
  oldPassword: string;

  @IsString({ message: 'New password must be a string' })
  @MinLength(6, { message: 'New password must be at least 6 characters' })
  newPassword: string;
}
