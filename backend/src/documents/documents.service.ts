import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AwsService } from '../aws/aws.service';
import { DocumentUpload } from '../models/Document.model';
import { UploadDocumentDto } from './dto/document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(DocumentUpload.name)
    private documentModel: Model<DocumentUpload>,
    private readonly awsService: AwsService,
  ) {}

  async uploadDBS(user: any, dto: UploadDocumentDto) {
    const doc = new this.documentModel({ user: user.userId, dbs: dto.dbs });
    await doc.save();
    return doc;
  }

  async uploadFile(user: any, file: Express.Multer.File) {
    const originalName = file.originalname || 'file';
    const key = `documents/${user.userId}/${Date.now()}_${originalName}`;

    // Use buffer upload (memoryStorage). Upload is async and non-blocking I/O.
    const url = await this.awsService.uploadBuffer(
      key,
      file.buffer,
      file.mimetype,
    );

    const doc = new this.documentModel({ user: user.userId, dbs: url });
    await doc.save();
    return { url, record: doc };
  }
}
