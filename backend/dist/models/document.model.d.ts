import { Document, Types } from 'mongoose';
export declare class DocumentUpload extends Document {
    user: Types.ObjectId;
    dbs: string;
    uploadedAt: Date;
}
export declare const DocumentUploadSchema: import("mongoose").Schema<DocumentUpload, import("mongoose").Model<DocumentUpload, any, any, any, Document<unknown, any, DocumentUpload, any, import("mongoose").DefaultSchemaOptions> & DocumentUpload & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any, DocumentUpload>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DocumentUpload, Document<unknown, {}, DocumentUpload, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<DocumentUpload & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, DocumentUpload, Document<unknown, {}, DocumentUpload, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<DocumentUpload & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    user?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, DocumentUpload, Document<unknown, {}, DocumentUpload, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<DocumentUpload & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    dbs?: import("mongoose").SchemaDefinitionProperty<string, DocumentUpload, Document<unknown, {}, DocumentUpload, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<DocumentUpload & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    uploadedAt?: import("mongoose").SchemaDefinitionProperty<Date, DocumentUpload, Document<unknown, {}, DocumentUpload, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<DocumentUpload & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, DocumentUpload>;
