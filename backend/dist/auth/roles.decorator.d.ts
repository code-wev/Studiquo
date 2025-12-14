export declare enum Role {
    Tutor = "Tutor",
    Student = "Student",
    Parent = "Parent",
    Admin = "Admin"
}
export declare const Roles: (...roles: Role[]) => import("@nestjs/common").CustomDecorator<string>;
