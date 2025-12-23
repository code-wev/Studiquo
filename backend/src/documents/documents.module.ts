import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { jwtConfig } from '../../common/jwt.config';
import { AwsModule } from '../aws/aws.module';
import { DocumentUpload, DocumentUploadSchema } from '../models/Document.model';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';

/**
 * Documents feature module.
 *
 * Registers the `DocumentUpload` schema and
 * exposes the `DocumentsService` and `DocumentsController` for the app.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DocumentUpload.name, schema: DocumentUploadSchema },
    ]),
    JwtModule.register(jwtConfig),
    AwsModule,
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
