import { Model } from 'mongoose';
import { DocumentUpload } from '../models/document.model';
import { UploadDocumentDto } from './dto/document.dto';
export declare class DocumentsService {
    private documentModel;
    constructor(documentModel: Model<DocumentUpload>);
    uploadDBS(req: {
        user: any;
    }, dto: UploadDocumentDto): Promise<import("mongoose").Document<unknown, {}, DocumentUpload, {}, import("mongoose").DefaultSchemaOptions> & DocumentUpload & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
