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

  @IsEnum(['Tutor', 'Student', 'Parent', 'Admin'], {
    message: 'Role must be one of Tutor|Student|Parent|Admin',
  })
  role: string;

  @IsOptional()
  @IsString({ message: 'Avatar must be a string (URL or path)' })
  avatar?: string;

  @IsOptional()
  @IsString({ message: 'Bio must be a string' })
  bio?: string;
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
