import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getUserSub } from '../../common/helpers';
import { DocumentUpload } from '../models/document.model';
import { UploadDocumentDto } from './dto/document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(DocumentUpload.name)
    private documentModel: Model<DocumentUpload>,
  ) {}

  async uploadDBS(req: { user: any }, dto: UploadDocumentDto) {
    const doc = new this.documentModel({ user: getUserSub(req), dbs: dto.dbs });
    await doc.save();
    return doc;
  }
}
