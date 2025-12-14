import { Document, Types } from 'mongoose';
export declare class TimeSlot extends Document {
    tutorAvailability: Types.ObjectId;
    startTime: Date;
    endTime: Date;
    isBooked: boolean;
    meetLink: string;
}
export declare const TimeSlotSchema: import("mongoose").Schema<TimeSlot, import("mongoose").Model<TimeSlot, any, any, any, Document<unknown, any, TimeSlot, any, import("mongoose").DefaultSchemaOptions> & TimeSlot & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any, TimeSlot>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TimeSlot, Document<unknown, {}, TimeSlot, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<TimeSlot & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, TimeSlot, Document<unknown, {}, TimeSlot, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<TimeSlot & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    tutorAvailability?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, TimeSlot, Document<unknown, {}, TimeSlot, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<TimeSlot & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    startTime?: import("mongoose").SchemaDefinitionProperty<Date, TimeSlot, Document<unknown, {}, TimeSlot, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<TimeSlot & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    endTime?: import("mongoose").SchemaDefinitionProperty<Date, TimeSlot, Document<unknown, {}, TimeSlot, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<TimeSlot & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isBooked?: import("mongoose").SchemaDefinitionProperty<boolean, TimeSlot, Document<unknown, {}, TimeSlot, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<TimeSlot & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    meetLink?: import("mongoose").SchemaDefinitionProperty<string, TimeSlot, Document<unknown, {}, TimeSlot, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<TimeSlot & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, TimeSlot>;
