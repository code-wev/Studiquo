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
        <p>You requested to reset your password.</p>
        <p>
          <a href="${resetLink}" target="_blank">
            Reset Password
          </a>
        </p>
        <p>If you didn’t request this, please ignore this email.</p>
      `,
    });
  }

  async sendVerifyEmail(email: string, verifyLink: string) {
    return this.sendMail({
      to: email,
      subject: 'Verify Your Email',
      html: `
        <p>Welcome!</p>
        <p>Please verify your email address.</p>
        <p>
          <a href="${verifyLink}" target="_blank">
            Verify Email
          </a>
        </p>
      `,
    });
  }
}
