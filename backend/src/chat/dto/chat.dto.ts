import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { MessageType } from '../../models/Message.model';

export class SendMessageDto {
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsEnum(MessageType)
  type?: MessageType;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString({ message: 'File URL must be a string' })
  fileUrl?: string;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString({ message: 'File name must be a string' })
  fileName?: string;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString({ message: 'File size must be a string' })
  fileSize?: number;

  @IsString({ message: 'Message content must be a string' })
  @IsNotEmpty({ message: 'Message content cannot be empty' })
  content: string;
}
