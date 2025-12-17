import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { jwtConfig } from 'common/jwt.config';
import { DocumentUpload, DocumentUploadSchema } from '../models/document.model';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DocumentUpload.name, schema: DocumentUploadSchema },
    ]),
    JwtModule.register(jwtConfig),
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
