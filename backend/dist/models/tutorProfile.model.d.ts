import { Document, Types } from 'mongoose';
export declare class TutorProfile extends Document {
    user: Types.ObjectId;
    subjects: string[];
    hourlyRate: number;
}
export declare const TutorProfileSchema: import("mongoose").Schema<TutorProfile, import("mongoose").Model<TutorProfile, any, any, any, Document<unknown, any, TutorProfile, any, import("mongoose").DefaultSchemaOptions> & TutorProfile & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any, TutorProfile>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TutorProfile, Document<unknown, {}, TutorProfile, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<TutorProfile & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, TutorProfile, Document<unknown, {}, TutorProfile, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<TutorProfile & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    user?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, TutorProfile, Document<unknown, {}, TutorProfile, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<TutorProfile & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    subjects?: import("mongoose").SchemaDefinitionProperty<string[], TutorProfile, Document<unknown, {}, TutorProfile, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<TutorProfile & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    hourlyRate?: import("mongoose").SchemaDefinitionProperty<number, TutorProfile, Document<unknown, {}, TutorProfile, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<TutorProfile & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, TutorProfile>;
