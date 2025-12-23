import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SearchDto {
  @IsOptional()
  @IsString({ message: 'Search query must be a string' })
  @IsNotEmpty({ message: 'Search query cannot be empty' })
  search?: string;
}
