import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendMail(options: {
    to: string;
    subject: string;
    html: string;
    text?: string;
  }) {
    try {
      const info = await this.transporter.sendMail({
        from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,
        ...options,
      });

      this.logger.log(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      this.logger.error('Email sending failed', error);
      throw error;
    }
  }

  // ======================
  // Reusable email helpers
  // ======================

  async sendResetPasswordEmail(email: string, resetLink: string) {
    return this.sendMail({
      to: email,
      subject: 'Reset Your Password',
      html: `
        <p>Hello,</p>
        <p>You requested to reset your password. This link will be valid for 5 minutes.</p>
        <p>
          <a href="${resetLink}" target="_blank">
            Reset Password
          </a>
        </p>
        <p>If you didn’t request this, please ignore this email.</p>
      `,
    });
  }

  async sendWelcomeEmail(email: string, name: string) {
    return this.sendMail({
      to: email,
      subject: 'Welcome to Our Service!',
      html: `
        <p>Hi ${name},</p>
        <p>Welcome to our service! We're excited to have you on board.</p>
        <p>Feel free to explore and let us know if you have any questions.</p>
        <p>Best regards,<br/>The Team</p>
      `,
    });
  }
}
