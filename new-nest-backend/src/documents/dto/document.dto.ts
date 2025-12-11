import { IsString } from 'class-validator';

export class UploadDocumentDto {
  @IsString()
  dbs: string;
}
