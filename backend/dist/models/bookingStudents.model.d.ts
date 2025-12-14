import { Document, Types } from 'mongoose';
export declare class BookingStudents extends Document {
    booking: Types.ObjectId;
    student: Types.ObjectId;
}
export declare const BookingStudentsSchema: import("mongoose").Schema<BookingStudents, import("mongoose").Model<BookingStudents, any, any, any, Document<unknown, any, BookingStudents, any, import("mongoose").DefaultSchemaOptions> & BookingStudents & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any, BookingStudents>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, BookingStudents, Document<unknown, {}, BookingStudents, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<BookingStudents & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, BookingStudents, Document<unknown, {}, BookingStudents, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<BookingStudents & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    booking?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, BookingStudents, Document<unknown, {}, BookingStudents, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<BookingStudents & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    student?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, BookingStudents, Document<unknown, {}, BookingStudents, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<BookingStudents & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, BookingStudents>;
