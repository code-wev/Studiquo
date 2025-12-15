import { IsNotEmpty, IsString } from 'class-validator';

export class SendMessageDto {
  @IsString({ message: 'Message content must be a string' })
  @IsNotEmpty({ message: 'Message content cannot be empty' })
  content: string;
}
