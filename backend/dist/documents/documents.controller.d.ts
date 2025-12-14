import { DocumentsService } from './documents.service';
import { UploadDocumentDto } from './dto/document.dto';
export declare class DocumentsController {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
    uploadDBS(req: any, dto: UploadDocumentDto): Promise<import("mongoose").Document<unknown, {}, import("../models/document.model").DocumentUpload, {}, import("mongoose").DefaultSchemaOptions> & import("../models/document.model").DocumentUpload & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
