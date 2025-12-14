export declare class MailService {
    private readonly logger;
    private transporter;
    constructor();
    sendMail(options: {
        to: string;
        subject: string;
        html: string;
        text?: string;
    }): Promise<any>;
    sendResetPasswordEmail(email: string, resetLink: string): Promise<any>;
    sendWelcomeEmail(email: string, name: string): Promise<any>;
}
