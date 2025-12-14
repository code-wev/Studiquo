import { IsNotEmpty, IsString } from 'class-validator';

export class UploadDocumentDto {
  @IsString({ message: 'DBS field must be a string' })
  @IsNotEmpty({ message: 'DBS value is required' })
  dbs: string;
}
