import { IsMongoId } from 'class-validator';

export class MongoIdDto {
  @IsMongoId({ message: 'Invalid MongoDB ID' })
  id: string;
}
