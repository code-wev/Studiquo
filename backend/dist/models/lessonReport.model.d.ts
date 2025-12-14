import { Document, Types } from 'mongoose';
export declare class LessonReport extends Document {
    booking: Types.ObjectId;
    description: string;
    dueDate: Date;
    submitted: boolean;
}
export declare const LessonReportSchema: import("mongoose").Schema<LessonReport, import("mongoose").Model<LessonReport, any, any, any, Document<unknown, any, LessonReport, any, import("mongoose").DefaultSchemaOptions> & LessonReport & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any, LessonReport>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, LessonReport, Document<unknown, {}, LessonReport, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<LessonReport & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, LessonReport, Document<unknown, {}, LessonReport, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<LessonReport & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, LessonReport, Document<unknown, {}, LessonReport, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<LessonReport & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    booking?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, LessonReport, Document<unknown, {}, LessonReport, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<LessonReport & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    dueDate?: import("mongoose").SchemaDefinitionProperty<Date, LessonReport, Document<unknown, {}, LessonReport, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<LessonReport & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    submitted?: import("mongoose").SchemaDefinitionProperty<boolean, LessonReport, Document<unknown, {}, LessonReport, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<LessonReport & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, LessonReport>;
