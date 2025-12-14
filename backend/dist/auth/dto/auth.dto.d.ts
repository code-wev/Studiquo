export declare class RegisterDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    bio?: string;
    dbsLink?: string;
    referralSource?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class ResetPasswordDto {
    email: string;
    newPassword: string;
    token: string;
}
export declare class ChangePasswordDto {
    userId: string;
    oldPassword: string;
    newPassword: string;
}
