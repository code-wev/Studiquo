import { Document, Types } from 'mongoose';
export declare class TutorAvailability extends Document {
    user: Types.ObjectId;
    date: Date;
}
export declare const TutorAvailabilitySchema: import("mongoose").Schema<TutorAvailability, import("mongoose").Model<TutorAvailability, any, any, any, Document<unknown, any, TutorAvailability, any, import("mongoose").DefaultSchemaOptions> & TutorAvailability & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any, TutorAvailability>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TutorAvailability, Document<unknown, {}, TutorAvailability, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<TutorAvailability & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    date?: import("mongoose").SchemaDefinitionProperty<Date, TutorAvailability, Document<unknown, {}, TutorAvailability, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<TutorAvailability & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, TutorAvailability, Document<unknown, {}, TutorAvailability, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<TutorAvailability & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    user?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, TutorAvailability, Document<unknown, {}, TutorAvailability, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<TutorAvailability & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, TutorAvailability>;
