import { Document, Types } from 'mongoose';
export declare class StudentProfile extends Document {
    user: Types.ObjectId;
    yearGroup: string;
    confidenceLevel: string;
    currentGrade: string;
    targetGrade: string;
}
export declare const StudentProfileSchema: import("mongoose").Schema<StudentProfile, import("mongoose").Model<StudentProfile, any, any, any, Document<unknown, any, StudentProfile, any, import("mongoose").DefaultSchemaOptions> & StudentProfile & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any, StudentProfile>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, StudentProfile, Document<unknown, {}, StudentProfile, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<StudentProfile & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, StudentProfile, Document<unknown, {}, StudentProfile, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<StudentProfile & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    user?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, StudentProfile, Document<unknown, {}, StudentProfile, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<StudentProfile & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    yearGroup?: import("mongoose").SchemaDefinitionProperty<string, StudentProfile, Document<unknown, {}, StudentProfile, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<StudentProfile & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    confidenceLevel?: import("mongoose").SchemaDefinitionProperty<string, StudentProfile, Document<unknown, {}, StudentProfile, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<StudentProfile & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    currentGrade?: import("mongoose").SchemaDefinitionProperty<string, StudentProfile, Document<unknown, {}, StudentProfile, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<StudentProfile & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    targetGrade?: import("mongoose").SchemaDefinitionProperty<string, StudentProfile, Document<unknown, {}, StudentProfile, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<StudentProfile & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, StudentProfile>;
