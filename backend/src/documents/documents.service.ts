import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentUpload } from '../models/Document.model';
import { UploadDocumentDto } from './dto/document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(DocumentUpload.name)
    private documentModel: Model<DocumentUpload>,
  ) {}

  async uploadDBS(user: any, dto: UploadDocumentDto) {
    const doc = new this.documentModel({ user: user.userId, dbs: dto.dbs });
    await doc.save();
    return doc;
  }
}
