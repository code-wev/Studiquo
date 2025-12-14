import { Document, Types } from 'mongoose';
export declare class ChatGroup extends Document {
    tutorId: Types.ObjectId;
    studentId: Types.ObjectId;
    parentId: Types.ObjectId;
    subject: string;
}
export declare const ChatGroupSchema: import("mongoose").Schema<ChatGroup, import("mongoose").Model<ChatGroup, any, any, any, Document<unknown, any, ChatGroup, any, import("mongoose").DefaultSchemaOptions> & ChatGroup & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any, ChatGroup>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ChatGroup, Document<unknown, {}, ChatGroup, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ChatGroup & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, ChatGroup, Document<unknown, {}, ChatGroup, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ChatGroup & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    subject?: import("mongoose").SchemaDefinitionProperty<string, ChatGroup, Document<unknown, {}, ChatGroup, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ChatGroup & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    tutorId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, ChatGroup, Document<unknown, {}, ChatGroup, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ChatGroup & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    studentId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, ChatGroup, Document<unknown, {}, ChatGroup, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ChatGroup & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    parentId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, ChatGroup, Document<unknown, {}, ChatGroup, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ChatGroup & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, ChatGroup>;
