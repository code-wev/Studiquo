import { UpdateProfileDto } from './dto/user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(req: {
        user: any;
    }): Promise<{
        profile: any;
        avatar: string;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role: string;
        token: string;
        bio: string;
        dbsLink: string;
        referralSource: string;
        _id: import("mongoose").Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }>;
    updateMe(req: {
        user: any;
    }, body: UpdateProfileDto): Promise<{
        profile: null;
        avatar?: string | undefined;
        firstName?: string | undefined;
        lastName?: string | undefined;
        email?: string | undefined;
        password?: string | undefined;
        role?: string | undefined;
        token?: string | undefined;
        bio?: string | undefined;
        dbsLink?: string | undefined;
        referralSource?: string | undefined;
        _id?: import("mongoose").Types.ObjectId | undefined;
        $locals?: Record<string, unknown> | undefined;
        $op?: "save" | "validate" | "remove" | null | undefined;
        $where?: Record<string, unknown> | undefined;
        baseModelName?: string;
        collection?: import("mongoose").Collection<import("bson").Document> | undefined;
        db?: import("mongoose").Connection | undefined;
        errors?: import("mongoose").Error.ValidationError;
        isNew?: boolean | undefined;
        schema?: import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
            [x: number]: unknown;
            [x: symbol]: unknown;
            [x: string]: unknown;
        }, import("mongoose").Document<unknown, {}, {
            [x: number]: unknown;
            [x: symbol]: unknown;
            [x: string]: unknown;
        }, {
            id: string;
        }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<{
            [x: number]: unknown;
            [x: symbol]: unknown;
            [x: string]: unknown;
        } & Required<{
            _id: unknown;
        }> & {
            __v: number;
        }, "id"> & {
            id: string;
        }, {
            [path: string]: import("mongoose").SchemaDefinitionProperty<undefined, any, any>;
        } | {
            [x: string]: import("mongoose").SchemaDefinitionProperty<any, any, import("mongoose").Document<unknown, {}, {
                [x: number]: unknown;
                [x: symbol]: unknown;
                [x: string]: unknown;
            }, {
                id: string;
            }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<{
                [x: number]: unknown;
                [x: symbol]: unknown;
                [x: string]: unknown;
            } & Required<{
                _id: unknown;
            }> & {
                __v: number;
            }, "id"> & {
                id: string;
            }> | undefined;
        }, {} & Required<{
            _id: unknown;
        }> & {
            __v: number;
        }> | undefined;
        __v?: number | undefined;
    }>;
    updatePassword(req: {
        user: any;
    }, body: any): Promise<{
        message: string;
    }>;
}
